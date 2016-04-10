function switch_to_view(item) {
  $(item).closest('li').removeClass('editing');
}

function reset_count() {
  var count = $('.todo-list > li:not(.completed):not(.empty-todo)').length;
  console.log($('.todo-list > li:not(.completed):not(.empty-todo)'));
  $('.todo-count > strong').text(count);
}

$(document).ready(function() {
  $(document).on('change', '.toggle', function() {
    var target = $(this).data('target');
    if ($(this).hasClass('ajax')) {
      $(this).removeClass('toggle').addClass('toggle-processing');
      var self = this;
      var todo_count = parseInt($('.todo-count > strong').text());
      $.ajax({
        url: target,
        success: function(data, textStatus, jqXHR) {
          if (data == 'OK') {
            $(self).closest('li').toggleClass('completed');
            /* ugly hack */
            if ($(self).is(':checked')) {
              if ($('.filters .selected').text() == 'Active') {
                $(self).closest('li').remove();
              } else {
                $(self).prop('checked', false);
              }
            } else {
              if ($('.filters .selected').text() == 'Completed') {
                $(self).closest('li').remove();
              } else {
                $(self).prop('checked', true);
              }
            }
            reset_count();
          }
        },
        complete: function(data, textStatus, jqXHR) {
          try {
            $(self).removeClass('toggle-processing').addClass('toggle');
            if ($(self).is(':checked')) {
              $(self).prop('checked', false);
            } else {
              $(self).prop('checked', true);
            }
          } catch(e) {}
        }
      });
    } else {
      window.location = target;
    }
  });
  
  $(document).on('keypress', 'form#new input[name=description]', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      if ($(this).hasClass('ajax')) {
        var self = this;
        $(this).closest('form').addClass('processing');
        $(this).closest('form').ajaxSubmit({
          resetForm: false,
          clearForm: false,
          success: function(data, textStatus, jqXHR) {
            var pk = parseInt(data);
            if (!isNaN(pk)) {
              var empty_todo = $('.empty-todo').clone().removeClass('empty-todo');
              empty_todo.find('label').text($(self).val());
              empty_todo.find('.edit').val($(self).val());
              var delete_button = empty_todo.find('button.destroy');
              delete_button.data('target', delete_button.data('target').replace(/\/\d+\//, '/'+pk+'/'));
              var toggle_checkbox = empty_todo.find('input[type=checkbox]');
              toggle_checkbox.data('target', toggle_checkbox.data('target').replace(/\/\d+\//, '/'+pk+'/'));
              var edit_form = empty_todo.find('form');
              edit_form.attr('action', edit_form.attr('action').replace(/\/\d+\//, '/'+pk+'/'));
              $(self).closest('form').resetForm();
              $('ul.todo-list').append(empty_todo);
              reset_count();
            } else {
              $(self).closest('form').addClass('error');
            }
            $(self).closest('form').removeClass('processing');
          },
          error: function(data, textStatus, jqXHR) {
            $(self).closest('form').removeClass('processing');
            $(self).closest('form').addClass('error');
          }
        });
      } else {
        $(this).closest('form').submit();
      }
    } else {
      $(this).closest('.error').removeClass('error');
    }
  });
  
  $(document).on('click', '.destroy', function(e) {
    e.preventDefault();
    var target = $(this).data('target') ;
    if ($(this).hasClass('ajax')) {
      $(this).removeClass('destroy').addClass('processing');
      var self = this;
      $.ajax({
        url: target,
        success: function(data, textStatus, jqXHR) {
          if (data == 'OK') {
            $(self).closest('li').remove();
            reset_count();
          }
        },
        complete: function(data, textStatus, jqXHR) {
          try {
            $(self).removeClass('processing').addClass('destroy');
          } catch(e) {}
        }
      });
    } else {
      window.location = target;
    }
  });
  
  $(document).on('click', '.view label', function(e) {
    e.preventDefault();
    $(this).closest('li').addClass('editing');
    $(this).closest('li').find('.edit').focus();
  });
  
  $(document).on('blur', '.edit', function(e) {
    e.preventDefault();
    switch_to_view(this);
  });
  
  $(document).on('keypress', 'form.edit-form input[name=description]', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      var self = this;
      $(this).closest('form').addClass('saving');
      $(this).closest('form').ajaxSubmit({
        resetForm: false,
        clearForm: false,
        success: function(data, textStatus, jqXHR) {
          if (data == 'OK') {
            $(self).closest('li').find('.view label').text($(self).val());
            switch_to_view(self);
          } else {
            $(self).closest('form').addClass('error');
          }
          $(self).closest('form').removeClass('saving');
        },
        error: function(data, textStatus, jqXHR) {
          $(self).closest('form').removeClass('saving');
          $(self).closest('form').addClass('error');
        }
      });
    } else {
      $(this).closest('.error').removeClass('error');
    }
  });
});