import React from "react";
import NetworkService, { NetworkTransformData } from "../../Services/NetworkService";

interface NetworkSyncProps {
    transform: THREE.Object3D;
    gameObject: any;
    selfSettings?: {
        isLocal?: boolean;
        remotePlayerId?: string;
        channelName?: string;
        syncRate?: number; // Updates per second
    };
    registerComponent: (component: any, displayName: string) => void;
}

/**
 * NetworkSync Component
 * 
 * Synchronizes transform data over the network.
 * 
 * Local mode (isLocal: true):
 * - Sends this GameObject's transform to the network channel.
 * 
 * Remote mode (isLocal: false):
 * - Receives transform updates for remotePlayerId and applies them.
 * 
 * Component settings:
 * - isLocal: true for local player, false for remote players
 * - remotePlayerId: ID of the remote player (only used when isLocal: false)
 * - channelName: Channel name for sync (default: 'game-sync')
 * - syncRate: Updates per second (default: 20)
 */
export class NetworkSync extends React.Component<NetworkSyncProps> {
    private networkService: NetworkService;
    private lastSyncTime: number = 0;
    private syncInterval: number = 50; // ms between syncs (20 Hz default)
    private isLocal: boolean = true;
    private remotePlayerId: string = '';
    private channelName: string = 'game-sync';
    private pendingTransform: NetworkTransformData | null = null;

    constructor(props: NetworkSyncProps) {
        super(props);
        this.networkService = NetworkService.getInstance();
    }

    start = (): void => {
        const { selfSettings, registerComponent } = this.props;

        // Register this component
        registerComponent(
            { component: this, update: this.update },
            'networkSync'
        );

        // Parse settings
        this.isLocal = selfSettings?.isLocal !== false;
        this.remotePlayerId = selfSettings?.remotePlayerId || '';
        this.channelName = selfSettings?.channelName || 'game-sync';

        if (selfSettings?.syncRate) {
            this.syncInterval = 1000 / selfSettings.syncRate;
        }

        // If remote, listen for transform updates
        if (!this.isLocal && this.remotePlayerId) {
            window.addEventListener('network-transform-update', this.handleTransformUpdate as EventListener);
            console.log(`[NetworkSync] Listening for updates from: ${this.remotePlayerId}`);
        } else {
            console.log(`[NetworkSync] Local mode - will broadcast transforms`);
        }
    };

    private handleTransformUpdate = (event: CustomEvent<NetworkTransformData>): void => {
        const data = event.detail;

        // Only accept updates for our remote player
        if (data.playerId !== this.remotePlayerId) {
            return;
        }

        this.pendingTransform = data;
    };

    update = (time: number): void => {
        if (this.isLocal) {
            this.updateLocal(time);
        } else {
            this.updateRemote();
        }
    };

    private updateLocal(time: number): void {
        const { transform } = this.props;

        // Check if we should sync
        if (time - this.lastSyncTime < this.syncInterval) {
            return;
        }

        if (!this.networkService.isSocketConnected()) {
            return;
        }

        this.lastSyncTime = time;

        // Build transform data
        const transformData: NetworkTransformData = {
            playerId: this.networkService.getLocalPlayerId(),
            position: {
                x: transform.position.x,
                y: transform.position.y,
                z: transform.position.z
            },
            rotation: {
                x: transform.rotation.x,
                y: transform.rotation.y,
                z: transform.rotation.z
            },
            scale: {
                x: transform.scale.x,
                y: transform.scale.y,
                z: transform.scale.z
            },
            timestamp: Date.now()
        };

        // Publish to channel
        this.networkService.publishTransform(this.channelName, transformData);
    }

    private updateRemote(): void {
        const { transform } = this.props;

        if (!this.pendingTransform) {
            return;
        }

        const data = this.pendingTransform;
        this.pendingTransform = null;

        // Apply position
        transform.position.set(
            data.position.x,
            data.position.y,
            data.position.z
        );

        // Apply rotation
        transform.rotation.set(
            data.rotation.x,
            data.rotation.y,
            data.rotation.z
        );

        // Apply scale if provided
        if (data.scale) {
            transform.scale.set(
                data.scale.x,
                data.scale.y,
                data.scale.z
            );
        }
    }

    componentWillUnmount(): void {
        if (!this.isLocal) {
            window.removeEventListener('network-transform-update', this.handleTransformUpdate as EventListener);
        }
    }

    render(): React.ReactNode {
        return null;
    }
}
