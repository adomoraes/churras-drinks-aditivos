import { supabase } from "@/lib/supabase"

export interface RankingUser {
	name: string
	total_presences: number
	level: string
}

export async function getFoliaRanking(): Promise<RankingUser[]> {
	// 1. Buscar check-ins do tipo 'presence' e incluir os dados do utilizador
	const { data, error } = await supabase
		.from("checkins")
		.select(
			`
      user_id,
      users ( name )
    `,
		)
		.eq("type", "presence")

	if (error) {
		console.error("Erro ao buscar ranking:", error)
		return []
	}

	// 2. Agrupar e contar presenças por utilizador
	const userCounts: Record<string, number> = {}
	data.forEach((item: any) => {
		const name = item.users?.name || "Folião Anónimo"
		userCounts[name] = (userCounts[name] || 0) + 1
	})

	// 3. Transformar em array, ordenar e atribuir níveis
	return Object.entries(userCounts)
		.map(([name, count]) => ({
			name,
			total_presences: count,
			level: getLevel(count),
		}))
		.sort((a, b) => b.total_presences - a.total_presences)
		.slice(0, 20) // Top 20 foliões
}

export async function getTopFoliao() {
	const ranking = await getFoliaRanking()
	return ranking.length > 0 ? ranking[0] : null
}

// Lógica de "Gamificação" para os níveis
function getLevel(count: number): string {
	if (count >= 10) return "Lenda do Carnaval 🏆"
	if (count >= 5) return "Folião Raiz 🔥"
	if (count >= 2) return "Pé de Valsa 💃"
	return "Estreante 🥁"
}
