"use client"

import { useEffect, useState } from "react"
import { getFoliaRanking, RankingUser } from "@/app/actions/ranking"
import Link from "next/link"

export default function RankingPage() {
	const [ranking, setRanking] = useState<RankingUser[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadRanking() {
			const data = await getFoliaRanking()
			setRanking(data)
			setLoading(false)
		}
		loadRanking()
	}, [])

	if (loading)
		return (
			<div className='min-h-screen flex items-center justify-center bg-amber-50'>
				<p className='animate-bounce font-black text-orange-500'>
					CARREGANDO FOLIA...
				</p>
			</div>
		)

	return (
		<main className='min-h-screen bg-amber-50 pb-20'>
			{/* Header */}
			<div className='bg-orange-500 p-8 text-white text-center rounded-b-[40px] shadow-lg mb-8'>
				<Link
					href='/'
					className='text-sm font-bold opacity-80 hover:opacity-100 transition-all'>
					← Voltar para os Blocos
				</Link>
				<h1 className='text-4xl font-black italic tracking-tighter mt-4'>
					REIS DA FOLIA 👑
				</h1>
				<p className='text-orange-100 font-medium'>
					Os maiores foliões do grupo
				</p>
			</div>

			<div className='max-w-md mx-auto px-4'>
				{/* Top 3 Pódio (Visual simplificado) */}
				<div className='flex items-end justify-center gap-4 mb-10 h-40'>
					{ranking[1] && (
						<div className='flex flex-col items-center'>
							<span className='text-xs font-bold text-gray-500 mb-1'>
								{ranking[1].total_presences} Blocos
							</span>
							<div className='w-16 bg-gray-300 rounded-t-xl flex items-end justify-center pb-2 h-20 text-white font-black text-2xl'>
								2º
							</div>
							<p className='text-[10px] font-bold mt-2 truncate w-16 text-center'>
								{ranking[1].name}
							</p>
						</div>
					)}
					{ranking[0] && (
						<div className='flex flex-col items-center'>
							<span className='text-xs font-bold text-orange-600 mb-1'>
								{ranking[0].total_presences} Blocos
							</span>
							<div className='w-20 bg-yellow-400 rounded-t-xl flex items-end justify-center pb-4 h-32 text-white font-black text-4xl shadow-xl'>
								1º
							</div>
							<p className='text-xs font-black mt-2 truncate w-20 text-center text-orange-700'>
								{ranking[0].name}
							</p>
						</div>
					)}
					{ranking[2] && (
						<div className='flex flex-col items-center'>
							<span className='text-xs font-bold text-gray-500 mb-1'>
								{ranking[2].total_presences} Blocos
							</span>
							<div className='w-16 bg-orange-300 rounded-t-xl flex items-end justify-center pb-2 h-16 text-white font-black text-xl'>
								3º
							</div>
							<p className='text-[10px] font-bold mt-2 truncate w-16 text-center'>
								{ranking[2].name}
							</p>
						</div>
					)}
				</div>

				{/* Lista Geral */}
				<div className='bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100'>
					{ranking.slice(3).map((user, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-5 border-b border-gray-50 last:border-none'>
							<div className='flex items-center gap-4'>
								<span className='font-black text-gray-300 text-lg'>
									#{index + 4}
								</span>
								<div>
									<p className='font-bold text-gray-800'>{user.name}</p>
									<p className='text-[9px] font-black uppercase tracking-tighter text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full inline-block'>
										{user.level}
									</p>
								</div>
							</div>
							<div className='bg-amber-50 px-4 py-2 rounded-2xl text-center border border-amber-100'>
								<span className='block leading-none font-black text-amber-600 text-xl'>
									{user.total_presences}
								</span>
								<span className='text-[8px] font-bold text-amber-400 uppercase'>
									Blocos
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}
