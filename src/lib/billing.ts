export async function calculateCurrentPSBill(
  startTime: string,
  hourlyRate: number,
  currentTime: Date = new Date()
) {
  // Dalam realita, kita harus pakai fungsi di server untuk validasi uang 
  // karena "trust no client". Ini util untuk tampil di UI.
  const start = new Date(startTime).getTime();
  const end = currentTime.getTime();
  
  if (end <= start) return 0;
  
  const diffMinutes = Math.floor((end - start) / (1000 * 60));
  
  // Karena diminta fleksibel: Misal tarif per menit diambil dari (tarif/jam) / 60
  // Jadi setiap menit bertambah proporpsional.
  const costPerMinute = hourlyRate / 60;
  
  return Math.floor(diffMinutes * costPerMinute);
}
