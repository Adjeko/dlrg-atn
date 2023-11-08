'use client'

import { useState } from "react";
import Link from "next/link";
import PocketBase from 'pocketbase';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation'
import { getPocketBase } from "@/services/pocketbase";


export default function Signin() {

	const pb = getPocketBase();

	const router = useRouter()

	const searchParams = useSearchParams()

	const [userInfo, setUserInfo] = useState({ email: "", password: "" });

	async function handleSubmit(e: any) {
		e.preventDefault();

		const authData = await pb.collection('users').authWithPassword(
			userInfo.email,
			userInfo.password,
		);
			console.log(pb.authStore.isValid);
		if (pb.authStore.isValid) {
			Cookies.set("pb_auth", pb.authStore.exportToCookie(), { secure: false, domain: 'localhost' });

			searchParams.get("originUrl") ? router.push(searchParams.get("originUrl") + "") : router.push("/")
		}
	}

	function getRegisterUrl() {
		
		if (searchParams.get("originUrl")) {
			const queryParamString = new URLSearchParams({"originUrl" : searchParams.get("originUrl")+""}).toString();
			return `/register?${queryParamString}`
		}
		else {
			return "/register"
		}
	}

	return (
		<>
			<div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<img
						className="w-full h-16 content-center bg-[#FF222B] py-2"
						src="https://asset.brandfetch.io/id1kbwnF66/id90RqLdal.svg?updated=1635891151637"
						alt="Workflow"
					/>
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">Melde dich an</h2>
					<p className="mt-2 text-sm text-center text-gray-600">
						<Link href={getRegisterUrl()} className="font-medium text-[#FF222B] hover:text-indigo-500">
							Registriere dich hier
						</Link>
					</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email address
								</label>
								<div className="mt-1">
									<input
										id="email"
										name="username"
										type="email"
										autoComplete="email"
										value={userInfo.email}
										required
										className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										onChange={({ target }) =>
											setUserInfo({ ...userInfo, email: target.value })
										}
									/>
								</div>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<div className="mt-1">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										value={userInfo.password}
										required
										className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										onChange={({ target }) =>
											setUserInfo({ ...userInfo, password: target.value })
										}
									/>
								</div>
							</div>

							{/* <div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
									/>
									<label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
										Remember me
									</label>
								</div>

								<div className="text-sm">
									<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
										Forgot your password?
									</a>
								</div>
							</div> */}

							<div>
								<button
									type="submit"
									className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#FF222B] border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Sign in
								</button>
							</div>
						</form>

					</div>
				</div>
			</div>
		</>
	)
}