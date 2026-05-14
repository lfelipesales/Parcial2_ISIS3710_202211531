import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { Strategy, StrategyOptions } from 'passport-jwt';

import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: (req: Request): string | null => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return null;
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer') {
          return null;
        }

        return token;
      },

      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET as string,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,

      email: payload.email,

      roles: payload.roles,
    };
  }
}
