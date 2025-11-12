function getTheme() {
    if (typeof document === undefined) {
        return
    }

    const documentElement = document.documentElement

    if (documentElement.dataset.theme === 'light') {
        return 'light'
    } else if (documentElement.dataset.theme === 'dark') {
        return 'dark'
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }

    return 'light'
}
const toggleBtn = document.getElementById('theme-toggle')

const toggleDarkMode = (fromScheme: string, toScheme: string) => {
    if (fromScheme === toScheme || !toggleBtn) {
      return
    }
  
    const { left, top } = toggleBtn.getBoundingClientRect()
    const { offsetWidth, offsetHeight } = document.documentElement
    const radius = Math.hypot(Math.max(left, offsetWidth - left), Math.max(offsetHeight - top, top))

    let clipPath = [
      `circle(0px at ${left}px ${top}px)`,
      `circle(${radius}px at ${left}px ${top}px)`
    ]
  
    if (toScheme === 'light') {
      clipPath = clipPath.reverse()
      document.documentElement.animate({
        clipPath,
        zIndex: [2, 2]
      }, {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: `::view-transition-old(root)`
      })
      return
    }
    
  
    document.documentElement.animate({
      clipPath
    }, {
      duration: 400,
      easing: 'ease-in-out',
      pseudoElement: `::view-transition-new(root)`
    })
}

toggleBtn?.addEventListener('click', async () => {
    const currentTheme = getTheme()
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'

    await document.startViewTransition(function () {
        document.documentElement.dataset.theme = newTheme
        localStorage.setItem("pref-theme", newTheme)
    }).ready
    toggleDarkMode(currentTheme!, newTheme)
})