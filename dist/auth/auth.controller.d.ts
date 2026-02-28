import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: {
        user: {
            sub: string;
            role: string;
        };
    }): {
        sub: string;
        role: string;
    };
}
