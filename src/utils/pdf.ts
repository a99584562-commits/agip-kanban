import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race<T | null>([
    p,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ])
}

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string,
): Promise<void> {
  // Don't hang if fonts.ready never resolves
  const fonts = (document as Document & { fonts?: FontFaceSet & { ready?: Promise<FontFaceSet> } }).fonts
  if (fonts?.ready) {
    await withTimeout(fonts.ready, 1500)
  }

  const prev = {
    width: el.style.width,
    height: el.style.height,
    overflow: el.style.overflow,
    maxHeight: el.style.maxHeight,
  }

  const fullWidth = Math.max(el.scrollWidth, el.clientWidth)
  el.style.width = `${fullWidth}px`
  el.style.height = 'auto'
  el.style.maxHeight = 'none'
  el.style.overflow = 'visible'

  // Let layout settle
  await new Promise<void>((r) => setTimeout(r, 30))
  const fullHeight = el.scrollHeight

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
      logging: false,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style')
        style.textContent = `
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .grain { display: none !important; }
          .scrollbar-thin::-webkit-scrollbar { display: none !important; }
          [data-pdf-root], [data-pdf-root] * {
            overflow: visible !important;
            max-height: none !important;
          }
          [data-pdf-column] {
            height: auto !important;
            min-height: 0 !important;
          }
          [data-pdf-column-body] {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        `
        clonedDoc.head.appendChild(style)
      },
    })

    const PX_TO_MM = 0.264583
    const cwMm = (canvas.width / 2) * PX_TO_MM
    const chMm = (canvas.height / 2) * PX_TO_MM
    const padMm = 10
    const pdfW = cwMm + padMm * 2
    const pdfH = chMm + padMm * 2

    const pdf = new jsPDF({
      orientation: pdfW > pdfH ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfW, pdfH],
      compress: true,
    })
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      padMm,
      padMm,
      cwMm,
      chMm,
      undefined,
      'FAST',
    )
    pdf.save(filename)
  } finally {
    el.style.width = prev.width
    el.style.height = prev.height
    el.style.overflow = prev.overflow
    el.style.maxHeight = prev.maxHeight
  }
}
