// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    const backToTopButton = document.getElementById('back-to-top');
    const typingText = document.getElementById('typing-text');
    const parallaxBackground = document.getElementById('parallax-bg');
    const contactForm = document.getElementById('contact-form');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            e.preventDefault();

            // 关闭移动菜单（如果打开）
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }

            window.scrollTo({
                top: targetElement.offsetTop - 80, // 考虑导航栏高度
                behavior: 'smooth'
            });
        });
    });
    
    // 导航栏滚动效果
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-dark', 'shadow-md');
                navbar.classList.remove('bg-opacity-95');
            } else {
                navbar.classList.remove('shadow-md');
                navbar.classList.add('bg-opacity-95');
            }
        });
    }
    
    // 回到顶部按钮
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
                backToTopButton.classList.remove('opacity-100', 'visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 打字效果
    const typingEffect = (element, words, typingSpeed = 100, pauseTime = 1000) => {
        if (!element || !words.length) {
            return;
        }

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
      
        function type() {
            const currentWord = words[wordIndex];
          
            if (isDeleting) {
                // 删除字符
                element.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // 添加字符
                element.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
          
            // 处理删除/添加状态转换
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, pauseTime); // 完成单词后暂停
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // 循环切换单词
                setTimeout(type, 200); // 短暂暂停后开始新单词
            } else {
                // 继续当前操作
                setTimeout(type, isDeleting ? typingSpeed/2 : typingSpeed);
            }
        }
      
        type(); // 启动动画
    };
    
    // 初始化打字效果
    if (typingText) {
        typingEffect(
            typingText,
            ['数字体验', '极简设计', '创意作品', '用户价值'],
            80,
            1000
        );
    }
    
    // 鼠标跟随效果已移除
    
    // 视差滚动效果
    const parallaxEffect = () => {
        if (!parallaxBackground) {
            return;
        }

        const maxBlur = 15;
        const minScale = 0.6;
      
        window.addEventListener('scroll', () => {
            // 计算滚动百分比 (0-1)
            const scrollY = window.scrollY;
            const scrollPercent = Math.min(scrollY / window.innerHeight, 1);
          
            // 应用模糊和缩放效果
            const currentBlur = scrollPercent * maxBlur;
            const currentScale = 1 - (scrollPercent * (1 - minScale));
          
            parallaxBackground.style.filter = `blur(${currentBlur}px)`;
            parallaxBackground.style.transform = `scale(${currentScale})`;
        });
    };
    
    // 初始化视差滚动效果
    parallaxEffect();
    
    // 滚动渐入效果
    const setupScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-scroll-reveal]');
        if (!revealElements.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(element => {
                element.style.opacity = '1';
                element.classList.add('animate-fade-in');
            });
            return;
        }
      
        const revealOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || 0;
                  
                    setTimeout(() => {
                        element.classList.add('animate-fade-in');
                      
                        // 对于字符渐入效果的处理
                        const charElements = element.querySelectorAll('.char-reveal');
                        charElements.forEach(charEl => {
                            const text = charEl.textContent;
                            charEl.textContent = '';
                          
                            // 将文本拆分为单个字符并逐个显示
                            for (let i = 0; i < text.length; i++) {
                                const span = document.createElement('span');
                                span.textContent = text[i];
                                span.style.opacity = '0';
                                span.style.filter = 'blur(4px)';
                                span.style.transition = 'all 0.3s';
                                span.style.transitionDelay = `${i * 30}ms`;
                                charEl.appendChild(span);
                              
                                // 强制重排后添加动画
                                setTimeout(() => {
                                    span.style.opacity = '1';
                                    span.style.filter = 'blur(0)';
                                }, 10);
                            }
                        });
                    }, delay);
                  
                    // 只触发一次
                    revealOnScroll.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
      
        revealElements.forEach(element => {
            revealOnScroll.observe(element);
            element.style.opacity = '0';
        });
    };
    
    // 初始化滚动渐入效果
    setupScrollReveal();
    
    // 表单提交处理
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('请填写必填字段');
                return;
            }

            const mailSubject = subject || `来自 ${name} 的网站留言`;
            const mailBody = [
                `姓名：${name}`,
                `邮箱：${email}`,
                '',
                message
            ].join('\n');

            const mailtoLink = `mailto:80202313@qq.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }
});
