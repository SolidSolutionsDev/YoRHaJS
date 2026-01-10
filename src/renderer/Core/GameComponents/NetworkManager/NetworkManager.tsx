import React from "react";
import NetworkService, { NetworkPlayerEvent } from "../../Services/NetworkService";

interface NetworkManagerProps {
    transform: THREE.Object3D;
    gameObject: any;
    selfSettings?: {
        hostname?: string;
        port?: number;
        playerId?: string;
        channelName?: string;
        playerPrefabId?: string;
    };
    instantiateFromPrefab: (
        prefabId: string,
        newId: string,
        transform: any,
        parentId: string,
        instantiationTime: number,
        components: any
    ) => void;
    destroyGameObjectById: (gameObjectId: string) => void;
    registerComponent: (component: any, displayName: string) => void;
}

interface RemotePlayer {
    gameObjectId: string;
    lastUpdate: number;
}

/**
 * NetworkManager Component
 * 
 * Manages network connections and remote player instantiation.
 * Add this component to your scene root or a dedicated network manager GameObject.
 * 
 * Component settings:
 * - hostname: SocketCluster server hostname (default: 'localhost')
 * - port: SocketCluster server port (default: 8000)
 * - playerId: Unique ID for this player (default: random UUID)
 * - channelName: Channel name for player sync (default: 'game-sync')
 * - playerPrefabId: Prefab ID to instantiate for remote players
 */
export class NetworkManager extends React.Component<NetworkManagerProps> {
    private networkService: NetworkService;
    private remotePlayers: Map<string, RemotePlayer> = new Map();
    private _isInitialized: boolean = false;
    private cleanupInterval: number | null = null;

    constructor(props: NetworkManagerProps) {
        super(props);
        this.networkService = NetworkService.getInstance();
    }

    start = async (): Promise<void> => {
        const { selfSettings, registerComponent } = this.props;

        // Register this component
        registerComponent(
            { component: this, update: this.update },
            'networkManager'
        );

        const hostname = selfSettings?.hostname || 'localhost';
        const port = selfSettings?.port || 8000;
        const playerId = selfSettings?.playerId || this.generatePlayerId();
        const channelName = selfSettings?.channelName || 'game-sync';

        console.log(`[NetworkManager] Connecting to ${hostname}:${port} as ${playerId}`);

        const connected = await this.networkService.connect(hostname, port, playerId);

        if (connected) {
            // Subscribe to game channel
            await this.networkService.subscribeToChannel(channelName, this.handleNetworkEvent);

            // Announce join if we have a prefab
            if (selfSettings?.playerPrefabId) {
                await this.networkService.announceJoin(channelName, selfSettings.playerPrefabId);
            }

            this._isInitialized = true;

            // Start cleanup interval for stale players (30 second timeout)
            this.cleanupInterval = setInterval(() => this.cleanupStalePlayers(), 5000);

            console.log('[NetworkManager] Initialized and listening');
        }
    };

    private generatePlayerId(): string {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private handleNetworkEvent = (event: NetworkPlayerEvent): void => {
        const localPlayerId = this.networkService.getLocalPlayerId();

        // Ignore our own messages
        if (event.playerId === localPlayerId) {
            return;
        }

        switch (event.type) {
            case 'join':
                this.handlePlayerJoin(event);
                break;
            case 'leave':
                this.handlePlayerLeave(event);
                break;
            case 'update':
                this.handlePlayerUpdate(event);
                break;
        }
    };

    private handlePlayerJoin(event: NetworkPlayerEvent): void {
        const { instantiateFromPrefab, gameObject, selfSettings } = this.props;

        if (this.remotePlayers.has(event.playerId)) {
            console.log(`[NetworkManager] Player ${event.playerId} already exists`);
            return;
        }

        const prefabId = event.prefabId || selfSettings?.playerPrefabId;
        if (!prefabId) {
            console.warn('[NetworkManager] No prefab ID for remote player');
            return;
        }

        const newGameObjectId = `remote_${event.playerId}`;

        console.log(`[NetworkManager] Spawning remote player: ${newGameObjectId}`);

        // Instantiate the remote player
        instantiateFromPrefab(
            prefabId,
            newGameObjectId,
            { position: { x: 0, y: 0, z: 0 } },
            gameObject.id,
            Date.now(),
            {
                // Add NetworkSync in remote mode
                networkSync: {
                    isLocal: false,
                    remotePlayerId: event.playerId
                }
            }
        );

        this.remotePlayers.set(event.playerId, {
            gameObjectId: newGameObjectId,
            lastUpdate: Date.now()
        });
    }

    private handlePlayerLeave(event: NetworkPlayerEvent): void {
        const { destroyGameObjectById } = this.props;

        const remotePlayer = this.remotePlayers.get(event.playerId);
        if (remotePlayer) {
            console.log(`[NetworkManager] Removing remote player: ${remotePlayer.gameObjectId}`);
            destroyGameObjectById(remotePlayer.gameObjectId);
            this.remotePlayers.delete(event.playerId);
        }
    }

    private handlePlayerUpdate(event: NetworkPlayerEvent): void {
        if (!event.data) return;

        const remotePlayer = this.remotePlayers.get(event.playerId);

        if (!remotePlayer) {
            // Player doesn't exist yet, treat as join
            this.handlePlayerJoin({
                ...event,
                type: 'join'
            });
            return;
        }

        // Update last seen timestamp
        remotePlayer.lastUpdate = Date.now();

        // The actual transform update is handled by NetworkSync component
        // We broadcast this event globally for NetworkSync instances to pick up
        window.dispatchEvent(new CustomEvent('network-transform-update', {
            detail: event.data
        }));
    }

    private cleanupStalePlayers(): void {
        const { destroyGameObjectById } = this.props;
        const now = Date.now();
        const timeout = 30000; // 30 seconds

        this.remotePlayers.forEach((player, playerId) => {
            if (now - player.lastUpdate > timeout) {
                console.log(`[NetworkManager] Removing stale player: ${playerId}`);
                destroyGameObjectById(player.gameObjectId);
                this.remotePlayers.delete(playerId);
            }
        });
    }

    update = (): void => {
        // Heartbeat logic could go here if needed
    };

    componentWillUnmount(): void {
        const { selfSettings } = this.props;
        const channelName = selfSettings?.channelName || 'game-sync';

        // Announce leave
        this.networkService.announceLeave(channelName);

        // Cleanup interval
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }

        // Disconnect
        this.networkService.disconnect();
    }

    render(): React.ReactNode {
        return null;
    }
}
