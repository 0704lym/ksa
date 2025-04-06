$(function () {
  CardEvent();
  pdfViewer2();
  popupEvent();
  emailjs.init("b8e8-w55_32iXg4e8"); 
  EmailEvent();
});

function CardEvent() {
  $('.more-btn').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('on');
    $(this).parent().siblings('.cont-area').toggleClass('on');
  });
};

function pdfViewer() {
 $('.icon-viewer').on('click',function(e){
  var pdfUrl = $(this).data("url"); // data-url 속성 값 가져오기
  if (pdfUrl) {
    window.open(pdfUrl, "_blank"); // 새 탭에서 열기
  } else {
    alert("PDF URL이 없습니다!");
  }
 })
}
function popupEvent(){
    var popup = $("#agree-modal");
    var closeBtn = $("#agree-modal .close");

    $(".btn.agree-popup").on("click", function (e) {
        e.preventDefault();
        popup.css("display", "flex");
    });

    closeBtn.on('click',function(){
        popup.css("display", "none");
    });
}
function pdfViewer2() {
    var pdfDoc = null,
        pageNum = 1,
        scale = 1.5,
        $canvas = $("#pdf-canvas"),
        ctx = $canvas[0].getContext("2d"),
        $modal = $("#pdf-modal"),
        $pageNum = $("#page-num"),
        $pageCount = $("#page-count");
  
    // PDF 아이콘 클릭 시
    $(".icon-viewer").on("click", function () {
      var pdfUrl = $(this).data("url");
      if (pdfUrl) {
        pageNum = 1; // 페이지 초기화
        $modal.css("display", "flex");
        loadPdf(pdfUrl);
      }
    });
  
    // 닫기 버튼 클릭 시
    $(".close").on("click", function () {
      $modal.css("display", "none");
    });
  
    // 모달 외부 클릭 시 닫기
    $(window).on("click", function (e) {
      if (e.target === $modal[0]) {
        $modal.css("display", "none");
      }
    });
  
    // PDF 로드
    function loadPdf(url) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
  
      pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdfDoc = pdf;
        $pageCount.text(pdf.numPages);
        renderPage(pageNum);
      });
    }
  
    // 페이지 렌더링
    function renderPage(num) {
      pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport({ scale: scale });
        $canvas.attr({
          height: viewport.height,
          width: viewport.width
        });
  
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext);
        $pageNum.text(num);
      });
    }
  
    // 이전 페이지
    $("#prev-page").on("click", function () {
      if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
      }
    });
  
    // 다음 페이지
    $("#next-page").on("click", function () {
      if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
      }
    });
  }

  function EmailEvent(){
    $('#submitBtn').on('click', function(e) {
      e.preventDefault();
  
      let isValid = true;
      let isChecked = $('#privacyCheck').is(':checked');
      let emptyFields = [];
  
      $('.input-wrap').each(function() {
        const input = $(this).find('input, textarea');
        const value = input.val().trim();
  
        if (value === '') {
          $(this).addClass('error');
          emptyFields.push(input.attr('id'));
          isValid = false;
        } else {
          $(this).removeClass('error');
        }
      });
  
      if (!isValid && !isChecked) {
        alert('모든 내용을 입력해주고 체크박스를 체크해주세요');
        return;
      }
  
      if (!isValid) {
        alert('모든 내용을 입력해주세요');
        return;
      }
  
      if (!isChecked) {
        alert('체크박스를 눌러주세요');
        return;
      }
  
      // EmailJS 메일 전송
      emailjs.send("service_s4zi8wf", "template_pljxgb8", {
        company: $('#company').val(),
        employee: $('#employeeCount').val(),
        manager: $('#manager').val(),
        contact: $('#contact').val(),
        email: $('#email').val(),
        message: $('#message').val()
      }).then(function(response) {
        alert("문의가 정상적으로 전송되었습니다!");
        $('input[type="text"], textarea').val('');
        $('#privacyCheck').prop('checked', false);
      }, function(error) {
        alert("메일 전송에 실패했습니다. 다시 시도해주세요.");
        console.error("EmailJS Error:", error);
      });
    });
  }
  

  