'use client';

import { signIn } from 'next-auth/react';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string(),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

const ComponentsAuthLoginForm = () => {
    const router = useRouter();

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        const { email, password } = data;

        try {
            const response: any = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (!response?.error) {
                router.push('/');
                router.refresh();
            }

            if (!response.ok) {
                throw new Error('Login failed');
            }

            toast.fire({
                title: 'Login success',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } catch (error: any) {
            console.error('Login Failed:', error);

            toast.fire({
                title: 'Login failed',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" {...register('email')} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" {...register('password')} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign in
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
