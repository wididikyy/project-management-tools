import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['member', 'admin', 'manager']).default('member'),
    timeZone: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, role, timeZone } = registerSchema.parse(body);

        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
                timeZone
            },
        });

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }
}