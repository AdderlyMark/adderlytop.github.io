        const toggleDisplay = (el, condition, display) => el.style.display = condition ? display : 'none';
        let existingNews = new Map();
        const allCpus = [];

        const collectCpuData = () => {
            document.querySelectorAll('table.sortable tbody tr').forEach(row => {
                const name = row.cells[0].textContent.trim();
                const single = parseInt(row.cells[1].textContent.trim());
                const multi = parseInt(row.cells[2].textContent.trim());
                allCpus.push({ name, single, multi, element: row });
            });
            console.log('Собраны данные процессоров:', allCpus.length);
        };

        const searchCpu = (query) => {
            const resultsDiv = document.getElementById('similar-cpu-results');
            const resultsTableBody = document.getElementById('similar-cpu-tbody');
            resultsTableBody.innerHTML = ''; 
            resultsDiv.style.display = 'none';

            if (query.length < 1) {
                return; 
            }
            const isGlobalSearch = query.startsWith('/');
            let cleanQuery = query;

            if (isGlobalSearch) {
                cleanQuery = query.substring(1).trim(); 
            }
            if (cleanQuery.length < 1) {
                return;
            }
            const lowerCleanQuery = cleanQuery.toLowerCase().replace(/-/g, '');

            let foundCpus = [];
            let matchedCpu = null;


            if (isGlobalSearch) {
                foundCpus = allCpus.filter(cpu => 
                    cpu.name.toLowerCase().replace(/-/g, '').includes(lowerCleanQuery)
                ).sort((a, b) => b.multi - a.multi);

            } else {
                matchedCpu = allCpus.find(cpu => cpu.name.toLowerCase().replace(/-/g, '').includes(lowerCleanQuery));

                if (!matchedCpu) {
                    resultsDiv.style.display = 'block';
                    const errorRow = document.createElement('tr');
                    const errorCell = document.createElement('td');
                    errorCell.setAttribute('colspan', '4');
                    errorCell.textContent = `Процессор "${query}" не найден в базе.`; 
                    errorRow.appendChild(errorCell);
                    resultsTableBody.appendChild(errorRow);
                    
                    return;
                }
                
                const singleTolerance = matchedCpu.single * 0.10;
                const multiTolerance = matchedCpu.multi * 0.10;

                const similarCpus = allCpus
                    .filter(cpu => cpu.name !== matchedCpu.name)
                    .filter(cpu => {
                        const isSimilarSingle = Math.abs(cpu.single - matchedCpu.single) <= singleTolerance;
                        const isSimilarMulti = Math.abs(cpu.multi - matchedCpu.multi) <= multiTolerance;
                        return isSimilarSingle && isSimilarMulti;
                    })
                    .sort((a, b) => {
                        const diffA = Math.abs(a.single - matchedCpu.single) + Math.abs(a.multi - matchedCpu.multi);
                        const diffB = Math.abs(b.single - matchedCpu.single) + Math.abs(b.multi - matchedCpu.multi);
                        return diffA - diffB;
                    })
                    .slice(0, 10);
                foundCpus.push(matchedCpu);
                foundCpus.push(...similarCpus);
            }
            
            if (foundCpus.length === 0) {
                resultsDiv.style.display = 'block';
                const notFoundRow = document.createElement('tr');
                const notFoundCell = document.createElement('td');
                notFoundCell.setAttribute('colspan', '4');
                notFoundCell.textContent = `По вашему запросу "${query}" ничего не найдено.`;
                notFoundRow.appendChild(notFoundCell);
                resultsTableBody.appendChild(notFoundRow);
                
                return;
            }
            
            resultsDiv.style.display = 'block';
            const titleElement = document.querySelector('.similar-cpu-results h3');
            if (isGlobalSearch) {
                titleElement.textContent = `Результаты глобального поиска по "${cleanQuery}" (отсортировано по Многопоточному):`;
            } else {
                titleElement.textContent = `Результат поиска и похожие процессоры (~10% по обоим показателям):`;
            }

            foundCpus.forEach((cpu, index) => {
                let comment = '';
                let matchClass = '';

                if (!isGlobalSearch) {
                    if (index === 0) {
                        comment = '(Найденный процессор)';
                        matchClass = 'match-text';
                    } else {
                        comment = '~10% по обоим показателям';
                    }
                } else {
                    comment = 'Глоб. Поиск';
                }

                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.classList.add('name');
                if (matchClass) nameCell.classList.add(matchClass);
                nameCell.textContent = cpu.name;
                row.appendChild(nameCell);

                const singleCell = document.createElement('td');
                singleCell.classList.add('score', 'sorttable_numeric');
                if (matchClass) singleCell.classList.add(matchClass);
                singleCell.textContent = cpu.single;
                row.appendChild(singleCell);

                const multiCell = document.createElement('td');
                multiCell.classList.add('score', 'sorttable_numeric');
                if (matchClass) multiCell.classList.add(matchClass);
                multiCell.textContent = cpu.multi;
                row.appendChild(multiCell);

                const commentCell = document.createElement('td');
                commentCell.style.color = matchClass ? '#ff9800' : 'inherit';
                commentCell.textContent = comment;
                row.appendChild(commentCell);

                resultsTableBody.appendChild(row);
            });
            
            if (typeof sorttable !== 'undefined') {
                const searchTable = resultsDiv.querySelector('table');
                if (searchTable) {
                    searchTable.classList.remove('sortable'); 
                    
                    searchTable.classList.add('sortable');
                    sorttable.makeSortable(searchTable);

                    const multiThreadHeader = searchTable.querySelector('thead tr th:nth-child(3)');
                    if (multiThreadHeader) {
                        sorttable.innerSortFunction.apply(multiThreadHeader, []);
                        sorttable.innerSortFunction.apply(multiThreadHeader, []);
                        multiThreadHeader.classList.remove('sorttable_sorted');
                        multiThreadHeader.classList.add('sorttable_sorted_reverse');
                    }
                }
            }
        };
                    collectCpuData(); 
            
            if (typeof sorttable !== 'undefined') {
                document.querySelectorAll('.sortable').forEach(table => {
                    sorttable.makeSortable(table);
                    console.log('Таблица инициализирована:', table);
                    const multiThreadHeader = table.querySelector('thead tr th:last-child');
                    if (multiThreadHeader) {
                        sorttable.innerSortFunction.apply(multiThreadHeader, []);
                        sorttable.innerSortFunction.apply(multiThreadHeader, []);
                        multiThreadHeader.classList.remove('sorttable_sorted');
                        multiThreadHeader.classList.add('sorttable_sorted_reverse');
                    }
                });
                document.querySelectorAll('th.score.sorttable_numeric').forEach(th => {
                    th.addEventListener('click', () => {
                        if (!th.classList.contains('sorttable_sorted') && !th.classList.contains('sorttable_sorted_reverse')) {
                            sorttable.innerSortFunction.apply(th, []);
                            sorttable.innerSortFunction.apply(th, []);
                            th.classList.remove('sorttable_sorted');
                            th.classList.add('sorttable_sorted_reverse');
                        }
                    });
                });
            } else {

            }

            const searchInput = document.getElementById('cpu-search');
            searchInput.addEventListener('input', (e) => {
                searchCpu(e.target.value.trim());
            });

function scrollToSection(sectionId) {
            if (sectionId === 'top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const section = document.getElementById(sectionId);
                if (section) {
                    const offsetPosition = section.getBoundingClientRect().top + window.pageYOffset - 110;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }

        function togglePanel() {
    const panel = document.querySelector('.floating-panel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('.floating-panel');
    panel.style.display = 'flex';
});