import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'defaultSecret',
    });
  }

  async validate(payload: any) {
    // Este objeto estará disponible como req.user
    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
    };
  }
}