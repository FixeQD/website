export const usePortfolioData = () => {
  const data = useState('portfolioData', () => null)
  const projects = useState('projects', () => null)

  const fetchData = async () => {
    if (!data.value) {
      data.value = await $fetch('/data.json')
    }
    if (!projects.value) {
      projects.value = await $fetch('/projects.json')
    }
  }

  return {
    data,
    projects,
    fetchData
  }
}
