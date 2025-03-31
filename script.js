// 检测设备类型
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - (isMobile ? 60 : 80),
                behavior: 'smooth'
            });
        }
    });
});

// 视差滚动效果 - 仅在非移动设备上启用
if (!isMobile) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });
}

// 元素出现动画
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.section, .experience-item, .education-item, .campus-item').forEach(el => {
    observer.observe(el);
});

// 动态背景效果 - 同时支持鼠标和触摸
const blobs = document.querySelectorAll('.gradient-blob');
let mouseX = 0;
let mouseY = 0;

const updateBlobPosition = (x, y) => {
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * (isMobile ? 0.1 : 0.2);
        const xPos = (x - window.innerWidth / 2) * speed;
        const yPos = (y - window.innerHeight / 2) * speed;
        
        blob.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
};

// 鼠标事件
document.addEventListener('mousemove', (e) => {
    if (!isMobile) {
        updateBlobPosition(e.clientX, e.clientY);
    }
});

// 触摸事件
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateBlobPosition(touch.clientX, touch.clientY);
    }
}, { passive: true });

// 滚动时改变背景色
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrolled / maxScroll;
    
    document.querySelector('.blob-1').style.opacity = 1 - scrollProgress;
    document.querySelector('.blob-2').style.opacity = scrollProgress;
    document.querySelector('.blob-3').style.opacity = Math.sin(scrollProgress * Math.PI);
});

// 技能卡片效果增强 - 同时支持触摸
const handleCardEffect = (card, x, y) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - rect.top) - centerY) / (isMobile ? 20 : 10);
    const rotateY = (centerX - (x - rect.left)) / (isMobile ? 20 : 10);
    
    card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(${isMobile ? 10 : 20}px)
        scale(${isMobile ? 1.02 : 1.05})
    `;
    
    // 添加光效
    const glareX = x - rect.left;
    const glareY = y - rect.top;
    
    const glare = `radial-gradient(
        circle at ${glareX}px ${glareY}px,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0) 50%
    )`;
    
    card.style.background = `
        linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.7)
        ),
        ${glare}
    `;
};

document.querySelectorAll('.skill-item').forEach(card => {
    // 鼠标事件
    card.addEventListener('mousemove', e => {
        if (!isMobile) {
            handleCardEffect(card, e.clientX, e.clientY);
        }
    });
    
    // 触摸事件
    card.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleCardEffect(card, touch.clientX, touch.clientY);
        }
    }, { passive: true });
    
    // 重置效果
    const resetCard = () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        card.style.background = 'rgba(255, 255, 255, 0.9)';
    };
    
    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('touchend', resetCard);
});

// 导航栏滚动效果优化
let lastScrollTop = 0;
let scrollTimeout;
const header = document.querySelector('.header');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (!isMobile) {
            if (scrollTop > lastScrollTop && scrollTop > heroBottom) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        header.style.backgroundColor = scrollTop > heroBottom ? 
            'rgba(255, 255, 255, 0.9)' : 
            'rgba(255, 255, 255, 0.8)';
        header.style.boxShadow = scrollTop > heroBottom ?
            '0 2px 20px rgba(0, 0, 0, 0.1)' :
            'none';
        
        lastScrollTop = scrollTop;
    }, 10);
}, { passive: true });

// 优化触摸设备的滚动性能
if (isMobile) {
    document.body.style.overscrollBehavior = 'none';
}

// 修复iOS Safari的滚动问题
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
}

// 添加滚动指示器
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
scrollIndicator.innerHTML = `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
`;
document.querySelector('.hero').appendChild(scrollIndicator);

// 修正名字
document.querySelector('.hero h1').textContent = '刘宗美';

// 图片加载优化
const profileImage = document.querySelector('.profile-image img');
if (profileImage) {
    profileImage.loading = 'lazy';
    profileImage.addEventListener('load', () => {
        profileImage.style.opacity = '1';
    });
}

// 英文说明文本动画
document.querySelectorAll('.title-en, .subtitle-en').forEach(text => {
    text.style.opacity = '0';
    text.style.transform = 'translateY(10px)';
    text.style.transition = 'all 0.4s ease';
});

// 观察英文文本
const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 200); // 延迟显示，创造级联效果
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.title-en, .subtitle-en').forEach(text => {
    textObserver.observe(text);
});

// 增强卡片悬停效果
document.querySelectorAll('.experience-item, .education-item, .campus-item').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
            scale(1.02)
        `;
        
        // 添加光效
        const glare = `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 50%
        )`;
        
        card.style.background = `
            linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95),
                rgba(255, 255, 255, 0.9)
            ),
            ${glare}
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        card.style.background = 'rgba(255, 255, 255, 0.9)';
    });
});

// 列表项动画
document.querySelectorAll('.project ul li, .achievements li').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(10px)';
        const arrow = item.querySelector('::before');
        if (arrow) {
            arrow.style.transform = 'translateX(5px)';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
        const arrow = item.querySelector('::before');
        if (arrow) {
            arrow.style.transform = 'translateX(0)';
        }
    });
}); 