import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { setCredentials } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import {  type LoginForm, } from '../types/models';
import { loginApi } from '../api/api.service';



const LoginPage: React.FC<{}> = () => {
    const { register, handleSubmit } = useForm<LoginForm>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {

        try {
            const response = await loginApi(data);


            dispatch(setCredentials(response.data));
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // כאן בהמשך SweetAlert2
        }
    };

    return (
        <div>
            <h2>Login Page</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Email:
                    <input
                        type="email"
                        {...register('email', { required: true })}
                    />
                </label>

                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        {...register('password', { required: true })}
                    />
                </label>

                <br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;