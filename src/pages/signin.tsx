import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react"

const SignIn = ({}: any) => {

	const router = useRouter()
	
	const [userInfo, setUserInfo] = useState({ email: "", password: "" });

	async function handleSubmit(e : any) {
		e.preventDefault();

		await signIn('credentials', {
			email: userInfo.email,
			password: userInfo.password,
			redirect: false,
		})

		const {callbackUrl: url} = router.query as {callbackUrl: string}
		router.replace(url ?? '/')
	}

	return (
		<>
			<div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<img
						className="w-auto h-12 mx-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt="Your Company"
					/>
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">Sign in to your account</h2>
					<p className="mt-2 text-sm text-center text-gray-600">
						<Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
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
									className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

export default SignIn