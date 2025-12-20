import { useState } from 'nuxt/app'
import portfolioData from '../assets/data.json'
import projectsData from '../assets/projects.json'

export const usePortfolioData = () => {
	const data = useState('portfolioData', () => portfolioData)
	const projects = useState('projects', () => projectsData)

	const fetchData = async () => {
		// Data is already loaded via import
	}

	return {
		data,
		projects,
		fetchData,
	}
}
