$(function() {
    jQuery.easing.def = "string";
    
    var currentScene = null;
    var kurikaesi = 0;
    const CARD_FRONTS = [
        '<img src=\"image/c01.png\">',
        '<img src=\"image/c02.png\">',
        '<img src=\"image/c03.png\">',
        '<img src=\"image/c04.png\">',
    ];

    var sceneFunctions = {
        'title': function() {
            $('#title-img').animate({
                top: '+=500px'
            }, 1000, 'easeOutBack', function() {
                $('#title p').animate({
                    top: '-=500px'
                }, 1000, 'easeOutBack', function() { });
            });
        },
        'ingame': function() {
            var holding_card = null;
            var shuffled_card = [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 0, 0];
            for (let i = shuffled_card.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled_card[i], shuffled_card[j]] = [shuffled_card[j], shuffled_card[i]];
            }
            var correct_cnt = 0;
            $('.card').each(function(i, e) {
                $(e).find('.back').append(CARD_FRONTS[shuffled_card[i]]);
                $(e).attr('data-card', shuffled_card[i]);
            });
            $('.card').flip({
                trigger: 'manual'
            });
            $('.card').click(function() {
                if (!($(this).data("flip-model").isFlipped)) {
                    var hantei = "";
                    $(this).flip(true);
                    if (holding_card == null) 
                        holding_card = this;
                    
                    // クリア判定
                    else if (correct_cnt >= 8) {
                        hantei = 'clear';
                    }

                    else {
                        // 判定が合った場合
                        if ($(holding_card).attr('data-card') == $(this).attr('data-card')) {
                            hantei = 'success';
                        }
                        else {
                            hantei = 'fail';
                        }
                    }

                    switch (hantei) {
                        case 'clear': 
                            clearflag = true;
                            $('#clear').attr('style', 'display: block');                            
                            $('#clear').animate({
                                top: '-=300px',
                                opacity: '0'
                            }, 1000, 'easeInSine', function() {
                                $(this).css('top', '50%');
                                $(this).css('opacity', '1');
                                $(this).attr('style', 'display: none');
                                window.location.reload();
                            });
                        break;

                        case 'success':
                            $(holding_card).flip(true);
                            $(this).flip(true);
                            holding_card = null;
                            correct_cnt += 1;
                            $('#right').attr('style', 'display: block');                            
                            $('#right').animate({
                                top: '-=300px',
                                opacity: '0'
                            }, 1000, 'easeInSine', function() {
                                $(this).css('top', '50%');
                                $(this).css('opacity', '1');
                                $(this).attr('style', 'display: none');
                            });
                        break;

                        case 'fail':
                            var current_card = this;
                            $('#wrong').attr('style', 'display: block');                            
                                $('#wrong').animate({
                                    top: '-=300px',
                                    opacity: '0'
                                }, 1000, 'easeInSine', function() {
                                    $(this).css('top', '50%');
                                    $(this).css('opacity', '1');
                                    $(this).attr('style', 'display: none');
                                    
                                    $(holding_card).flip(false);
                                    $(current_card).flip(false);
                                    holding_card = null;
                                });
                        break;

                        default:
                                kurikaesi += 1;
                                $('#kurikaesi').text(kurikaesi);
                        break;
                    }

                }
            });
        }
    };

    function switchScene(s_) {
        $('.scene').each(function(i, e) {
            if ($(e).attr('id') == s_) {
                currentScene = e;
                $(e).css({'display': 'block'});
            }
            else
                $(e).css({'display': 'none'});
        });
        sceneFunctions[s_]();
    }

    $('body').keydown(function(e) {
        switch($(currentScene).attr('id')) {
            case 'title': 
                switchScene('ingame');
            break;
            case 'ingame': 
                switch (e.keyCode) {
                    case 38: // up
                    break;
                    case 37: // left
                    break;
                    case 39: // right
                    break;
                    case 40: // down
                    break;
                }
            break;
        }
    });

    switchScene('title');
});