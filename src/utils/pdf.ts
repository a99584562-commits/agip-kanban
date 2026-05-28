import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
): Promise<void> {
  const fullWidth = Math.max(el.scrollWidth, el.clientWidth)
  const fullHeight = Math.max(el.scrollHeight, el.clientHeight)

  const prevWidth = el.style.width
  const prevHeight = el.style.height
  const prevOverflow = el.style.overflow

  el.style.width = `${fullWidth}px`
  el.style.height = `${fullHeight}px`
  el.style.overflow = 'visible'

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f4f6fb',
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      scrollX: 0,
      scrollY: 0,
    })

    const PX_TO_MM = 0.264583
    const wMm = (canvas.width / 2) * PX_TO_MM
    const hMm = (canvas.height / 2) * PX_TO_MM
    const padding = 8

    const pdf = new jsPDF({
      orientation: wMm > hMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [wMm + padding * 2, hMm + padding * 2],
      compress: true,
    })
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.92),
      'JPEG',
      padding,
      padding,
      wMm,
      hMm,
      undefined,
      'FAST',
    )
    pdf.save(filename)
  } finally {
    el.style.width = prevWidth
    el.style.height = prevHeight
    el.style.overflow = prevOverflow
  }
}
