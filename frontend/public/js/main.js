[file name]: frontend/public/js/main.js
// 通用功能模块
document.addEventListener('DOMContentLoaded', () => {
  // 自动隐藏消息提示
  setTimeout(() => {
    const alerts = document.querySelectorAll('.auto-hide');
    alerts.forEach(alert => alert.style.display = 'none');
  }, 5000);

  // 下载按钮通用处理
  document.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const accessCode = btn.dataset.download;
      
      try {
        // 预验证访问码
        const verifyRes = await fetch(`/api/download/info/${accessCode}`);
        if (!verifyRes.ok) throw new Error('Invalid access code');
        
        // 触发下载
        window.location.href = `/api/download/${accessCode}`;
      } catch (error) {
        alert(error.message);
      }
    });
  });

  // 剪贴板功能
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text)
        .then(() => showToast('Copied to clipboard!'))
        .catch(() => showToast('Copy failed!'));
    });
  });
});

// 显示临时提示
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast alert alert-${type} position-fixed bottom-0 end-0 m-3`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

// 文件下载验证
function validateDownload(accessCode) {
  return fetch(`/api/download/info/${accessCode}`)
    .then(res => res.ok)
    .catch(() => false);
}