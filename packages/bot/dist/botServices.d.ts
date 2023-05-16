export default class BotServices {
    constructor();
    private isEmpty;
    private formatThreadContent;
    private isServerError;
    private isConnectionError;
    private isNetworkError;
    private request;
    authenticateBot(token: string, channelId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleThreads(channelId: string): Promise<{
        success: boolean;
        title: any;
        url: any;
        image: any;
        content: any;
        msg: string;
    }>;
    handleShows(channelId: string): Promise<{
        success: boolean;
        title: any;
        url: any;
        image: any;
        content: any;
        msg: string;
    }>;
}
