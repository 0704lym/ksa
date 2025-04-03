$(function () {
  CardEvent();
  pdfViewer2();
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

function pdfViewer2(){
  var pdfDoc = null,
        pageNum = 1,
        scale = 2,
        canvas = document.getElementById("pdf-canvas"),
        ctx = canvas.getContext("2d");

    // 모달 요소
    var modal = document.getElementById("pdf-modal");
    var closeBtn = document.querySelector(".close");
    $(".icon-viewer").on("click", function () {
        var pdfUrl = $(this).data("url");
        if (pdfUrl) {
            modal.style.display = "flex"; // 모달 열기
            loadPdf(pdfUrl);
        }
    });

    closeBtn.onclick = function () {
        modal.style.display = "none"; // 모달 닫기
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none"; // 바깥 클릭 시 닫기
        }
    };

    function loadPdf(url) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

        pdfjsLib.getDocument(url).promise.then(function (pdf) {
            pdfDoc = pdf;
            document.getElementById("page-count").textContent = pdf.numPages;
            renderPage(pageNum);
        });
    }

    function renderPage(num) {
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            page.render(renderContext);
            document.getElementById("page-num").textContent = num;
        });
    }

    $("#prev-page").on("click", function () {
        if (pageNum > 1) {
            pageNum--;
            renderPage(pageNum);
        }
    });

    $("#next-page").on("click", function () {
        if (pageNum < pdfDoc.numPages) {
            pageNum++;
            renderPage(pageNum);
        }
    });
}