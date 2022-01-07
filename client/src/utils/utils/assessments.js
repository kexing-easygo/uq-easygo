export const mergeAssResult = (assessments, results) => {
  return assessments.map(ass => {
    const calculated = results.find(res => res.description === ass.description);
    return {
      ...ass,
      ...calculated
    }
  })
}