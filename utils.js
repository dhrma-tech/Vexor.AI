// --- IMPORTANT: Set your backend URL here ---
export const RENDER_URL = 'https://vexor-ai.onrender.com'; // Backend API URL

/**
 * Gets a color based on a score.
 * @param {number} score - A number between 0 and 100.
 * @returns {string} A hex color code.
 */
export function getScoreColor(score) {
    if (score >= 90) return '#34d399'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
}
