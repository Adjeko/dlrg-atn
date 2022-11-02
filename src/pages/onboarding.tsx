import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const OnBoarding = () => {

  const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");

  const router = useRouter()

  function onSubmit(e : any) {
		e.preventDefault();

		router.push("/");
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
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">Du bist das erste Mal hier ?</h2>
					<p className="mt-2 text-sm text-center text-gray-600">
						<p className="font-medium text-indigo-600 hover:text-indigo-500">
							Erzähl was über dich. Diese Informationen kannst du in deinem Profil auch nachträglich noch ändern.
						</p>
					</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
						<form className="space-y-6" action="/onboarding" method="POST">
							<div>
								<label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
									Vorname
								</label>
								<div className="mt-1">
									<input
										id="firstname"
										required
										className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</div>
							</div>

							<div>
								<label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
									Nachname
								</label>
								<div className="mt-1">
									<input
										id="lastname"
										required
										className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										onChange={(e) => setLastName(e.target.value)}
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									onClick={onSubmit}
								>
									Loslegen
								</button>
							</div>
						</form>

					</div>
				</div>
			</div>
		</>
	)
}

export default OnBoarding