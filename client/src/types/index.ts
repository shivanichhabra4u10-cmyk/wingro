// client/src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface GrowthJourney {
    id: string;
    userId: string;
    goals: string[];
    progress: number;
    createdAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
}