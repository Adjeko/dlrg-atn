import { useState } from "react";
import { Client, Account } from 'appwrite';
import { useDLRGStore } from '../src/useDLRGStore'

const OnBoarding = () => {

  const user = useDLRGStore((state) => state.user)
  const session = useDLRGStore((state) => state.session)

	return (
		<>
			<h1>ONBOARDING</h1>
      {JSON.stringify(user)}

      {JSON.stringify(session)}
		</>
	)
}

export default OnBoarding