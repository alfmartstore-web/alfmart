(function() {
    const savedTheme = localStorage.getItem('alfmart-theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();