const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('status');
const sendBtn = document.getElementById('send-btn');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  statusDiv.textContent = '';


  const SERVICE_ID = 'service_aw8qssh';  
  const TEMPLATE_ID = 'template_ipawipd'; 

  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
    .then(function(response) {
      // success
      statusDiv.style.color = 'green';
      statusDiv.textContent = 'Message sent — thank you!';
      form.reset();
    }, function(error) {
      // failure
      
      statusDiv.textContent = 'thank you!';
      console.error('EmailJS error:', error);
    }).finally(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = 'Send Message <i class="fa fa-paper-plane pl-3"></i>';
    });
});
