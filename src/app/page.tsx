"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getBlockStatus, BlockStatus } from "@/utils/date"
import {
	registerInterestAction,
	registerPresenceAction,
} from "./actions/checkin"
import { getTopFoliao, RankingUser } from "@/app/actions/ranking"
import { Countdown } from "@/components/BlockAction"
import { getDistanceInMeters } from "@/utils/geo"
import Link from "next/link"

// Interfaces para tipagem
interface CheckInInfo {
	type: "interest" | "presence"
	users: { name: string }
}

interface Block {
	id: string
	name: string
	start_time: string
	end_time: string
	location_name: string
	latitude: number
	longitude: number
	checkins: CheckInInfo[]
}

export default function HomePage() {
	const [blocks, setBlocks] = useState<Block[]>([])
	const [loading, setLoading] = useState(true)
	const [userId, setUserId] = useState<string | null>(null)
	const [userName, setUserName] = useState<string>("")
	const [interestedBlocks, setInterestedBlocks] = useState<string[]>([])
	const [confirmedPresences, setConfirmedPresences] = useState<string[]>([])
	const [isProcessing, setIsProcessing] = useState<string | null>(null)
	const [hasMounted, setHasMounted] = useState(false)
	const [topUser, setTopUser] = useState<RankingUser | null>(null)

	useEffect(() => {
		setHasMounted(true)
		const savedUser = localStorage.getItem("@blocos:user")
		if (savedUser) {
			const user = JSON.parse(savedUser)
			setUserId(user.id)
			setUserName(user.name)
			fetchUserData(user.id)
		}
		fetchBlocks()

		// Busca o líder dinamicamente
		getTopFoliao().then(setTopUser)
	}, [])

	async function fetchBlocks() {
		const { data } = await supabase
			.from("blocks")
			.select(
				`
				*,
				checkins (
					type,
					users ( name )
				)
			`,
			)
			.order("start_time", { ascending: true })

		if (data) setBlocks(data as unknown as Block[])
		setLoading(false)
	}

	async function fetchUserData(uid: string) {
		const { data } = await supabase
			.from("checkins")
			.select("block_id, type")
			.eq("user_id", uid)

		if (data) {
			setInterestedBlocks(
				data.filter((i) => i.type === "interest").map((i) => i.block_id),
			)
			setConfirmedPresences(
				data.filter((i) => i.type === "presence").map((i) => i.block_id),
			)
		}
	}

	// Função para atualizar os badges sociais localmente (Instantâneo)
	const updateLocalCheckins = (
		blockId: string,
		type: "interest" | "presence",
	) => {
		setBlocks((prev) =>
			prev.map((b) => {
				if (b.id === blockId) {
					return {
						...b,
						checkins: [
							...(b.checkins || []),
							{ type, users: { name: userName } },
						],
					}
				}
				return b
			}),
		)
	}

	async function handleInterest(blockId: string) {
		if (!userId) return alert("Faz login primeiro!")
		setIsProcessing(blockId)

		const result = await registerInterestAction(userId, blockId)
		if (result.success) {
			setInterestedBlocks((prev) => [...prev, blockId])
			updateLocalCheckins(blockId, "interest")
		} else {
			alert(result.error || "Erro ao registar interesse")
		}
		setIsProcessing(null)
	}

	async function handleCheckIn(block: Block) {
		if (!userId) return alert("Faz login primeiro!")
		setIsProcessing(block.id)

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords
				const distance = getDistanceInMeters(
					latitude,
					longitude,
					block.latitude,
					block.longitude,
				)

				if (distance <= 300) {
					const result = await registerPresenceAction(userId, block.id)
					if (result.success) {
						setConfirmedPresences((prev) => [...prev, block.id])
						updateLocalCheckins(block.id, "presence")
						alert("✅ Presença confirmada!")
					} else {
						alert(result.error)
					}
				} else {
					alert(
						`📍 Fora do raio! (${Math.round(distance)}m). Aproxima-te do bloco.`,
					)
				}
				setIsProcessing(null)
			},
			() => {
				alert("Erro ao aceder ao GPS.")
				setIsProcessing(null)
			},
			{ enableHighAccuracy: true },
		)
	}

	if (loading)
		return (
			<div className='min-h-screen flex items-center justify-center bg-orange-50'>
				<p className='font-bold text-orange-600 animate-pulse'>
					🥁 Carregando blocos...
				</p>
			</div>
		)

	return (
		<main className='min-h-screen bg-gray-50 pb-10'>
			<header className='flex items-center justify-between mb-8'>
				<div>
					<h1 className='text-4xl font-black italic tracking-tighter text-orange-600'>
						BLOCOS DA VILA 🎊
					</h1>
					<p className='text-gray-500 font-bold text-xs uppercase tracking-widest'>
						Carnaval 2026 • São Paulo
					</p>
				</div>

				{/* Botão do Ranking */}
				<Link
					href='/ranking'
					className='bg-white p-3 rounded-2xl shadow-md border-b-4 border-amber-200 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center'>
					<span className='text-2xl'>🏆</span>
					<span className='text-[10px] font-black text-amber-600'>RANKING</span>
				</Link>
			</header>
			{/* CARD DINÂMICO DO LÍDER */}
			{topUser && (
				<Link href='/ranking' className='block mb-8 group'>
					<div className='bg-linear-to-r from-orange-500 to-amber-400 p-5 rounded-3xl shadow-lg text-white flex items-center justify-between relative overflow-hidden'>
						<div className='relative z-10'>
							<div className='flex items-center gap-2 mb-1'>
								<span className='bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter'>
									Líder da Vila 👑
								</span>
							</div>
							<h3 className='text-2xl font-black'>{topUser.name}</h3>
							<p className='text-sm font-bold opacity-90'>
								{topUser.total_presences} blocos curtidos 🔥
							</p>
						</div>

						<div className='text-5xl opacity-40 group-hover:rotate-12 transition-transform duration-300'>
							{topUser.total_presences > 10 ? "🥇" : "🔥"}
						</div>

						{/* Círculos decorativos de fundo */}
						<div className='absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>
					</div>
				</Link>
			)}
			<div className='p-4 space-y-6'>
				{blocks.map((block) => {
					const status = hasMounted
						? getBlockStatus(block.start_time, block.end_time)
						: "futuro"
					const hasInterest = interestedBlocks.includes(block.id)
					const hasPresence = confirmedPresences.includes(block.id)

					return (
						<div
							key={block.id}
							className='bg-white rounded-3xl shadow-sm border border-orange-100 p-5'>
							<div className='flex justify-between items-start mb-3'>
								<h2 className='text-lg font-extrabold text-gray-900 uppercase'>
									{block.name}
								</h2>
								{hasMounted && <StatusBadge status={status} />}
							</div>

							<div className='space-y-1 mb-4 text-sm text-gray-600'>
								<p>
									📍{" "}
									<span className='font-semibold'>{block.location_name}</span>
								</p>
								<p suppressHydrationWarning>
									⏰{" "}
									{hasMounted
										? new Date(block.start_time).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})
										: "--:--"}
								</p>
							</div>

							{/* --- SPRINT 5: STATUS SOCIAL DINÂMICO --- */}
							<div className='mb-5 border-t border-gray-50 pt-3'>
								{(() => {
									const userMap: Record<string, { i: boolean; p: boolean }> = {}
									block.checkins?.forEach((c) => {
										const n = c.users?.name.split(" ")[0] || "Folião"
										if (!userMap[n]) userMap[n] = { i: false, p: false }
										if (c.type === "interest") userMap[n].i = true
										if (c.type === "presence") userMap[n].p = true
									})

									const users = Object.keys(userMap)
									if (users.length === 0)
										return (
											<p className='text-xs text-gray-400 italic'>
												Ninguém confirmado ainda.
											</p>
										)

									// 1. EVENTO EM ANDAMENTO (Ajuste solicitado)
									if (status === "em_andamento") {
										const aqui = users.filter((name) => userMap[name].p)
										const vindo = users.filter(
											(name) => userMap[name].i && !userMap[name].p,
										)

										return (
											<div className='space-y-3'>
												{/* Sub-lista: Quem está aqui */}
												{aqui.length > 0 && (
													<div>
														<p className='text-[9px] uppercase font-black text-green-600 mb-1 tracking-tighter'>
															Quem está aqui 📍
														</p>
														<div className='flex flex-wrap gap-2'>
															{aqui.map((name) => (
																<span
																	key={name}
																	className='text-[11px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-bold flex items-center gap-1'>
																	{userMap[name].i ? "🔥" : "✨"} {name}
																</span>
															))}
														</div>
													</div>
												)}

												{/* Sub-lista: Quem vai (Interessados que ainda não deram check-in) */}
												{vindo.length > 0 && (
													<div>
														<p className='text-[9px] uppercase font-black text-blue-600 mb-1 tracking-tighter'>
															Quem vai 🔵
														</p>
														<div className='flex flex-wrap gap-2'>
															{vindo.map((name) => (
																<span
																	key={name}
																	className='text-[11px] px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600'>
																	{name}
																</span>
															))}
														</div>
													</div>
												)}
											</div>
										)
									}

									// 2. EVENTO FUTURO
									if (status === "futuro") {
										return (
											<div>
												<p className='text-[9px] uppercase font-black text-gray-400 mb-1 tracking-tighter'>
													Interessados:
												</p>
												<div className='flex flex-wrap gap-2'>
													{users.map((name) => (
														<span
															key={name}
															className='text-[11px] px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-500'>
															🔵 {name}
														</span>
													))}
												</div>
											</div>
										)
									}

									// 3. EVENTO ENCERRADO
									if (status === "encerrado") {
										return (
											<div>
												<p className='text-[9px] uppercase font-black text-gray-400 mb-1 tracking-tighter'>
													Resumo da presença:
												</p>
												<div className='flex flex-wrap gap-2'>
													{users.map((name) =>
														userMap[name].p ? (
															<span
																key={name}
																className='text-[11px] px-2 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 font-bold italic'>
																✅ {name}
															</span>
														) : (
															<span
																key={name}
																className='text-[11px] px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-400 italic'>
																💤 {name}
															</span>
														),
													)}
												</div>
											</div>
										)
									}
								})()}
							</div>

							{/* --- ÁREA DE ACÇÃO --- */}
							<div className='relative'>
								{!hasMounted ? (
									<div className='w-full h-12 bg-gray-100 rounded-2xl animate-pulse' />
								) : (
									<>
										{status === "futuro" ? (
											!hasInterest ? (
												<button
													onClick={() => handleInterest(block.id)}
													disabled={isProcessing === block.id}
													className='w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-md active:scale-95 disabled:opacity-50'>
													{isProcessing === block.id
														? "A guardar..."
														: "Tenho Interesse 🙋‍♂️"}
												</button>
											) : (
												<div className='w-full py-4 bg-blue-50 text-blue-700 rounded-2xl font-bold text-center border-2 border-dashed border-blue-200'>
													<Countdown
														startTime={block.start_time}
														onFinish={() => fetchBlocks()}
													/>
												</div>
											)
										) : status === "em_andamento" ? (
											hasPresence ? (
												<button
													disabled
													className='w-full py-4 bg-green-100 text-green-700 border-2 border-green-500 rounded-2xl font-black'>
													ESTOU AQUI! ✅
												</button>
											) : (
												<button
													onClick={() => handleCheckIn(block)}
													disabled={isProcessing === block.id}
													className='w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg animate-pulse active:scale-95'>
													{isProcessing === block.id
														? "A ler GPS..."
														: "Fazer Check-in 📍"}
												</button>
											)
										) : (
											<button
												disabled
												className='w-full py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold'>
												Bloco Encerrado 😴
											</button>
										)}
									</>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</main>
	)
}

function StatusBadge({ status }: { status: BlockStatus }) {
	const config = {
		futuro: { label: "Próximo", style: "bg-blue-100 text-blue-600" },
		em_andamento: {
			label: "AO VIVO",
			style: "bg-green-500 text-white shadow-md",
		},
		encerrado: { label: "Finalizado", style: "bg-gray-100 text-gray-500" },
	}
	const { label, style } = config[status]
	return (
		<span
			className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${style}`}>
			{label}
		</span>
	)
}
