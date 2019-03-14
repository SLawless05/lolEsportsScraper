// Wait to attach our handlers until the DOM is fully loaded.
$(function () {

    function clear() {
        $("#well-section").empty();
    }

    $("#scrape-btn").on("click", function () {
        event.preventDefault();

        clear();

        $.ajax("/scrape", {
            type: "GET",
            function() {
                $('#scrapeModal').modal('show');
            }
        }).then(function () {
            $(".scrapeCloseBtn").on("click", function () {
                window.location.href = '/';
            });
        });
    });

    $(document).on("click", "#clear-btn", function () {
        event.preventDefault();
        $('#warningModal').modal('show');
    });

    $("#destroy-btn").on("click", function () {
        event.preventDefault();
        location.reload();

        $.ajax({
            type: 'DELETE',
            url: '/drop-articles',
            success: function (response) {
                if (response == 'error') {
                    console.log('Err!');
                }
            }
        });
    });

    $(".save-btn").on("click", function () {
        event.preventDefault();
        var id = $(this).data("id");

        $.ajax({
            url: "/saved/" + id,
            type: "PUT",
            success: function () {
                $('#saveArticleModal').modal('show');
            }
        })
            .then(function () {
                $(".saveArticleCloseBtn").on("click", function () {
                    window.location.href = '/';
                });
            });
    });

    $(".notes-btn").on("click", function () {
        event.preventDefault();
        $(".noteArea").empty();
        var articleId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/getnotes/" + articleId,
            success: function () {
                $('#notesModal').modal('show');
            }
        })
            .then(function (data) {
                var id = data._id;
                $(".modal-title").html(data.title);
                $(".saveNoteBtn").attr("data-id", id);

                if (data.notes) {
                    console.log(data.notes);
                    for (i = 0; i < data.notes.length; i++) {
                        $(".noteArea").append(
                            "<div class='card-body notecard' id='notecard'>" +
                            "<h4 class='notecardTitle' data-id='" + data.notes[i]._id + "'>" +
                            data.notes[i].title +
                            "</h4>" +
                            "<button type='button' class='btn btn-danger deleteNote' data-id='" + data.notes[i]._id + "'>Delete</button>" +
                            "</div>"
                        );
                        $(".noteArea").append(
                            "<hr>"
                        );
                    }
                }
            });
    });

    $(document).on("click", ".notecardTitle", function () {
        var noteId = $(this).attr("data-id");
        console.log("noteId by title: " + noteId);

        $.ajax({
            method: "GET",
            url: "/getsinglenote/" + noteId
        })
            .then(function (data) {
                console.log(data);

                if (data) {
                    $("#titleinput").val(data.title);
                    $("#bodyinput").val(data.body);
                }
            })
    });

    $(document).on("click", ".deleteNote", function () {
        var noteId = $(this).attr("data-id");
        console.log("noteId: " + noteId);

        $.ajax({
            method: "DELETE",
            url: "/deletenote/" + noteId
        })
            .then(function (data) {
                console.log(data);
                window.location.href = '/saved-articles';
            })
    });

    $(".saveNoteBtn").on("click", function () {
        var articleId = $(this).attr("data-id");
        $.ajax({
            url: "/postnotes/" + articleId,
            method: "POST",
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {

                window.location.href = '/saved-articles';
            });
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });


    $(".return-btn").on("click", function () {
        event.preventDefault();
        var id = $(this).data("id");

        $.ajax({
            url: "/returned/" + id,
            type: "PUT",
            success: function () {
                $('#returnArticleModal').modal('show');
            }
        })
            .then(function () {
                $(".returnArticleCloseBtn").on("click", function () {
                    window.location.href = '/saved-articles';
                });
            });
    });

})