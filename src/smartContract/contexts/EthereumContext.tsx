
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ethers } from "ethers"

// Internal imports
import type { Ethereum } from "../types/Ethereum"

type EthereumContextType = {
	account: string
	connectWallet: () => Promise<void>
	ethereum: Ethereum
	metaMaskMissing: boolean
}

const EthereumContext = createContext<EthereumContextType | undefined>(undefined)

interface EthereumProviderProps {
	children: ReactNode
}

export const EthereumProvider = (props: EthereumProviderProps) => {

	const [account, setAccount] = useState<string>("")
	const [ethereum, setEthereum] = useState<Ethereum | null>(null)
	const [metaMaskMissing, setMetaMaskMissing] = useState(false)

	useEffect(() => {
		if (typeof window !== "undefined" && window.ethereum) {
			setEthereum(window.ethereum as Ethereum)
		} else {
			setMetaMaskMissing(true)
		}
	}, [])

	const connectWallet = async () => {
		if (!ethereum) {
			setMetaMaskMissing(true)
			return
		}
		try {
			const provider = new ethers.BrowserProvider(ethereum)
			const accounts = await provider.send("eth_requestAccounts", [])
			setAccount(accounts[0])
		} catch (error) {
			console.error("Error connecting wallet:", error)
		}
	}

	return (
		<EthereumContext.Provider
			value={{
				account,
				connectWallet,
				ethereum: ethereum as Ethereum,
				metaMaskMissing,
			}}
		>
			{props.children}
		</EthereumContext.Provider>
	)
}

export const useEthereum = () => {
	const context = useContext(EthereumContext)
	if (!context) throw new Error("useEthereum must be used within EthereumProvider")
	return context
}