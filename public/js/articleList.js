$("#articlesLink").parent().addClass("active");
$("#articlesLink").parent().siblings().removeClass("active");
getArticlesPage(1, NAME_FILTER);
searchBar.addEventListener('change', (e) => {
    NAME_FILTER = `&name=${e.target.value}`;
    getArticlesPage(PAGES.current, NAME_FILTER);
});
