/**
 * NetworkService - Singleton for SocketCluster connection management.
 * 
 * Usage:
 * 1. Call NetworkService.getInstance().connect(url) to establish connection.
 * 2. Use subscribe/publish methods to interact with channels.
 */

// Type definitions for socketcluster-client
interface AGClientSocket {
    state: string;
    subscribe(channelName: string): AGChannel;
    transmitPublish(channelName: string, data: unknown): Promise<void>;
    closeAllChannels(): void;
    disconnect(): void;
}

interface AGChannel {
    createConsumer(): AsyncIterableIterator<unknown>;
    close(): void;
}

interface SocketClusterClientModule {
    create(options: { hostname: string; port: number; autoConnect?: boolean }): AGClientSocket;
}

// Transform data structure for network sync
export interface NetworkTransformData {
    playerId: string;
    prefabId?: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    timestamp: number;
}

export interface NetworkPlayerEvent {
    type: 'join' | 'leave' | 'update';
    playerId: string;
    prefabId?: string;
    data?: NetworkTransformData;
}

type NetworkEventCallback = (event: NetworkPlayerEvent) => void;

class NetworkService {
    private static instance: NetworkService | null = null;
    private socket: AGClientSocket | null = null;
    private localPlayerId: string = '';
    private isConnected: boolean = false;
    private eventListeners: Map<string, Set<NetworkEventCallback>> = new Map();
    private activeChannels: Map<string, AGChannel> = new Map();

    private constructor() {
        // Private constructor for singleton
    }

    static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    /**
     * Connect to SocketCluster server
     */
    async connect(hostname: string, port: number, playerId: string): Promise<boolean> {
        if (this.isConnected) {
            console.warn('[NetworkService] Already connected');
            return true;
        }

        try {
            // Dynamic import to handle cases where socketcluster-client isn't installed
            const socketClusterClient: SocketClusterClientModule = await import('socketcluster-client');

            this.localPlayerId = playerId;
            this.socket = socketClusterClient.create({
                hostname,
                port,
                autoConnect: true
            });

            // Wait for connection
            await this.waitForConnection();

            this.isConnected = true;
            console.log(`[NetworkService] Connected as player: ${playerId}`);

            return true;
        } catch (error) {
            console.error('[NetworkService] Connection failed:', error);
            return false;
        }
    }

    private waitForConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('Socket not initialized'));
                return;
            }

            const checkConnection = () => {
                if (this.socket?.state === 'open') {
                    resolve();
                } else {
                    setTimeout(checkConnection, 100);
                }
            };

            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Connection timeout')), 10000);
            checkConnection();
        });
    }

    /**
     * Subscribe to a channel and process incoming messages
     */
    async subscribeToChannel(channelName: string, callback: NetworkEventCallback): Promise<void> {
        if (!this.socket || !this.isConnected) {
            console.error('[NetworkService] Not connected');
            return;
        }

        // Store callback
        if (!this.eventListeners.has(channelName)) {
            this.eventListeners.set(channelName, new Set());
        }
        this.eventListeners.get(channelName)!.add(callback);

        // Subscribe if not already subscribed
        if (!this.activeChannels.has(channelName)) {
            const channel = this.socket.subscribe(channelName);
            this.activeChannels.set(channelName, channel);

            // Start consuming messages
            this.consumeChannel(channelName, channel);
        }
    }

    private async consumeChannel(channelName: string, channel: AGChannel): Promise<void> {
        try {
            for await (const data of channel.createConsumer()) {
                const listeners = this.eventListeners.get(channelName);
                if (listeners) {
                    listeners.forEach(callback => {
                        try {
                            callback(data as NetworkPlayerEvent);
                        } catch (e) {
                            console.error('[NetworkService] Callback error:', e);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(`[NetworkService] Channel ${channelName} error:`, error);
        }
    }

    /**
     * Publish transform data to a channel
     */
    async publishTransform(channelName: string, transform: NetworkTransformData): Promise<void> {
        if (!this.socket || !this.isConnected) {
            return;
        }

        try {
            await this.socket.transmitPublish(channelName, {
                type: 'update',
                playerId: this.localPlayerId,
                data: transform
            } as NetworkPlayerEvent);
        } catch (error) {
            console.error('[NetworkService] Publish failed:', error);
        }
    }

    /**
     * Announce player join
     */
    async announceJoin(channelName: string, prefabId: string): Promise<void> {
        if (!this.socket || !this.isConnected) {
            return;
        }

        try {
            await this.socket.transmitPublish(channelName, {
                type: 'join',
                playerId: this.localPlayerId,
                prefabId
            } as NetworkPlayerEvent);
        } catch (error) {
            console.error('[NetworkService] Announce join failed:', error);
        }
    }

    /**
     * Announce player leave
     */
    async announceLeave(channelName: string): Promise<void> {
        if (!this.socket || !this.isConnected) {
            return;
        }

        try {
            await this.socket.transmitPublish(channelName, {
                type: 'leave',
                playerId: this.localPlayerId
            } as NetworkPlayerEvent);
        } catch (error) {
            console.error('[NetworkService] Announce leave failed:', error);
        }
    }

    /**
     * Get local player ID
     */
    getLocalPlayerId(): string {
        return this.localPlayerId;
    }

    /**
     * Check if connected
     */
    isSocketConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Disconnect from server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.closeAllChannels();
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.activeChannels.clear();
        this.eventListeners.clear();
        console.log('[NetworkService] Disconnected');
    }
}

export default NetworkService;
