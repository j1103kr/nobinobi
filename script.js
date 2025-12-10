document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 📌 1. 상단 이동 버튼 기능 (topBtn) 및 Navbar 스크롤 효과
    // ----------------------------------------------------
    const topBtn = document.getElementById("topBtn");
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 10; // 10px 이상 스크롤 했을 때 그림자 추가

    // topBtn 초기화 및 이벤트 연결
    if (topBtn) {
        // 스크롤 시 버튼 표시/숨김
        window.addEventListener("scroll", () => {
            if (window.scrollY > 250) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        });

        // 버튼 클릭 시 상단 이동
        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Navbar 스크롤 효과 핸들러
    function handleScroll() {
        if (navbar) {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // 스크롤 이벤트에 함수 연결
    window.addEventListener('scroll', handleScroll);
    
    // 페이지 로드 시 초기 상태 확인
    handleScroll();

    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('#navbar nav'); // <nav> 요소를 선택

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // 햄버거 아이콘의 상태를 전환 (X자 애니메이션)
            menuToggle.classList.toggle('active'); 
            
            // 메뉴의 가시성을 전환 (active-menu 클래스를 토글)
            nav.classList.toggle('active-menu');
        });
    }

    // ----------------------------------------------------
    // 📌 4. 메뉴 항목 클릭 시 메뉴 닫기 (사용자 경험 개선)
    // ----------------------------------------------------
    const navLinks = document.querySelectorAll('#navbar nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // 모바일 메뉴가 활성화되어 있을 때만 닫기
            if (nav && nav.classList.contains('active-menu')) {
                nav.classList.remove('active-menu');
            }
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
            }
        });
    });

    
    function setActiveLink() {
        // 현재 URL의 경로를 가져옵니다.
        const currentPathname = window.location.pathname.toLowerCase().split('/').pop(); 

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').toLowerCase();
            
            // 이전에 설정된 active 클래스 제거
            link.classList.remove('active');

            // 외부 링크나 아이콘은 건너뜁니다.
            if (linkHref.startsWith('http') || link.classList.contains('social-icon')) {
                return;
            }

            // 1) 앵커 링크 (한 페이지 내 이동)인 경우
            if (linkHref.startsWith('#')) {
                const sections = document.querySelectorAll('.main-section');
                const navbarHeight = navbar ? navbar.offsetHeight : 0; 
                let activeSectionId = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - navbarHeight - 50; // 기준점
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        activeSectionId = '#' + section.id;
                    }
                });

                if (linkHref === activeSectionId) {
                    link.classList.add('active');
                }
            } 
            // 2) 파일 링크 (다른 페이지로 이동)인 경우
            else {
                // 링크의 파일 이름과 현재 URL의 파일 이름이 같을 때 활성화
                if (currentPathname === linkHref) {
                    link.classList.add('active');
                }
            }
        });
    }

    // 스크롤 이벤트와 로드 이벤트에 함수 연결 및 즉시 실행
    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink); 
    setActiveLink();


    // ----------------------------------------------------
    // 📌 3. 메인 페이지 슬라이드 쇼 기능 (Carousel)
    // ----------------------------------------------------

    // index.html 페이지일 때만 슬라이드 쇼 기능을 활성화합니다.
    const isIndexPage = (window.location.pathname.toLowerCase().split('/').pop() === 'index.html' || window.location.pathname.toLowerCase().split('/').pop() === '');
    
    if (isIndexPage) {
        let slideIndex = 1;
        let slideTimer;
        
        // 초기 슬라이드 표시
        showSlides(slideIndex); 
        startAutoSlide();

        function showSlides(n) {
            const slides = document.querySelectorAll(".mySlides");
            const dots = document.querySelectorAll(".dot");

            if (slides.length === 0) return; 

            if (n > slides.length) {slideIndex = 1}    
            if (n < 1) {slideIndex = slides.length}

            slides.forEach(slide => {
                slide.style.display = "none";  
            });
            
            dots.forEach(dot => {
                dot.classList.remove("active-dot");
            });

            slides[slideIndex-1].style.display = "block";  
            if (dots.length >= slideIndex) {
                 dots[slideIndex-1].classList.add("active-dot");
            }
        }

        // 수동 전환 (이전/다음 버튼)
        window.plusSlides = function(n) {
            clearTimeout(slideTimer); 
            showSlides(slideIndex += n);
            startAutoSlide(); 
        }

        // 수동 전환 (도트 인디케이터)
        window.currentSlide = function(n) {
            clearTimeout(slideTimer); 
            showSlides(slideIndex = n);
            startAutoSlide(); 
        }

        // 자동 전환 로직
        function autoSlide() {
            showSlides(slideIndex += 1);
            slideTimer = setTimeout(autoSlide, 5000); 
        }

        // 자동 전환 시작 함수
        function startAutoSlide() {
            slideTimer = setTimeout(autoSlide, 5000);
        }
    }
    
});