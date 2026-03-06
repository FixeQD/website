import { ref } from 'vue'

interface LangStat {
	name: string
	percent: number
	color: string
}

interface GithubStats {
	contributions: number
	commits: number
	stars: number
	topLanguages: LangStat[]
}

const API_BASE = 'https://github-readme-stats.fixeq.me/api/json'

export const useGithubStats = (username: string) => {
	const stats = ref<GithubStats | null>(null)
	const loading = ref(true)

	const fetch = async () => {
		try {
			const data = await $fetch<any>(`${API_BASE}?username=${username}`)

			const total =
				data.contributesLanguage?.reduce(
					(sum: number, l: any) => sum + l.contributions,
					0
				) ?? 0

			const topLanguages: LangStat[] = (data.contributesLanguage ?? [])
				.slice(0, 5)
				.map((l: any) => ({
					name: l.language,
					color: l.color,
					percent: total > 0 ? Math.round((l.contributions / total) * 100) : 0,
				}))

			stats.value = {
				contributions: data.totalContributions ?? 0,
				commits: data.totalCommitContributions ?? 0,
				stars: data.totalStargazerCount ?? 0,
				topLanguages,
			}
		} catch {
			stats.value = null
		} finally {
			loading.value = false
		}
	}

	return { stats, loading, fetch }
}
