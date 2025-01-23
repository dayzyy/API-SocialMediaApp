export const format_time = date => {
  const current_date = new Date()

  const [year, month, day, hour, minute, second] = date.split(" ")
  const post_date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
  )

  const diff_in_seconds = Math.floor((current_date - post_date) / 1000)
  if (diff_in_seconds < 60) return `${diff_in_seconds} second${diff_in_seconds === 1 ? '' : 's'} ago`

  const diff_in_minutes = Math.floor(diff_in_seconds / 60)
  if (diff_in_minutes < 60) return `${diff_in_minutes} minute${diff_in_minutes === 1 ? '' : 's'} ago`

  const diff_in_hours = Math.floor(diff_in_minutes / 60)
  if (diff_in_hours < 24) return `${diff_in_hours} hour${diff_in_hours === 1 ? '' : 's'} ago`

  const diff_in_days = Math.floor(diff_in_hours / 24)
  if (diff_in_days < 30) return `${diff_in_days} day${diff_in_days === 1 ? '' : 's'} ago`

  const diff_in_months = Math.floor(diff_in_days / 30)
  if (diff_in_months < 12) return `${diff_in_months} month${diff_in_months === 1 ? '' : 's'} ago`

  const diff_in_years = Math.floor(diff_in_days / 365)
  return `${diff_in_years} year${diff_in_years === 1 ? '' : 's'} ago`
}
