// Setups top panel
Bone.setup_panel = function()
{
    let menu_icon = Bone.$('#menu_icon')

    menu_icon.addEventListener('click', function(e)
    {
        Bone.show_menu()
    })

    menu_icon.addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            Bone.new_space()
        }
    })

    let panel = Bone.$('#panel')

    panel.addEventListener('click', function(e)
    {
        if(e.target === this)
        {
            Bone.show_menu()
        }
    })

    panel.addEventListener('mouseenter', function()
    {
        clearInterval(Bone.panel_autohide_timeout)

        if(!Bone.panel_active)
        {
            Bone.show_panel()
        }
    })

    panel.addEventListener('mouseleave', function()
    {
        if(Bone.panel_active)
        {
            Bone.start_panel_auto_hide()
        }
    })

    panel.addEventListener('wheel', function(e)
    {
        if(!Bone.storage.cycle_spaces_on_wheel)
        {
            return false
        }

        if(e.deltaY < 0)
        {
            Bone.switch_space('left')
        }

        else
        {
            Bone.switch_space('right')
        }
    })

    let spaces = Bone.$('#spaces')

    spaces.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('spaces_item'))
        {
            return false
        }

        if(parseInt(e.target.dataset.num) === Bone.current_space)
        {
            let space = Bone.space()

            if(space.name)
            {
                Bone.show_handle_preset(space.name)
            }

            else
            {
                Bone.info('You can create presets based on current settings. You can open them in different spaces, as well as setting them to autostart.')
            }
        }

        else
        {
            Bone.change_space(parseInt(e.target.dataset.num))
        }
    })

    spaces.addEventListener('auxclick', function(e)
    {
        if(!e.target.classList.contains('spaces_item'))
        {
            return false
        }

        if(e.which === 2)
        {
            Bone.close_space(parseInt(e.target.dataset.num))
        }
    })

    Bone.$('#panel_history').addEventListener('click', function(e)
    {
        Bone.show_history()
    })

    Bone.$('#panel_zoom_in').addEventListener('click', function(e)
    {
        Bone.increase_zoom(Bone.num())
    })

    Bone.$('#panel_zoom_out').addEventListener('click', function(e)
    {
        Bone.decrease_zoom(Bone.num())
    })

    Bone.$('#panel_focused').addEventListener('click', function(e)
    {
        let num = Bone.num() + 1

        if(num > Bone.wvs().length)
        {
            num = 1
        }

        Bone.focus_webview(num)
    })

    Bone.$('#url').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            let url = this.value.trim()
            Bone.change_url(Bone.num(), url, false, false)
        }
    })

    panel.style.height = `${Bone.config.panel_height}px`
}

// Starts a timeout to automatically hide the top panel
Bone.start_panel_auto_hide = function()
{
    if(!Bone.storage.auto_hide_panel)
    {
        return false
    }

    clearInterval(Bone.panel_autohide_timeout)

    Bone.panel_autohide_timeout = setTimeout(function()
    {
        Bone.hide_panel()
    }, Bone.config.panel_auto_hide_delay)
}

// Shows the top panel
Bone.show_panel = function()
{
    clearInterval(Bone.panel_autohide_timeout)

    let tp = Bone.$('#panel')
    tp.style.top = '0'
    Bone.panel_active = true
}

// Hides the top panel
Bone.hide_panel = function()
{
    clearInterval(Bone.panel_autohide_timeout)

    let tp = Bone.$('#panel')
    tp.style.top = `-${Bone.config.panel_height - Bone.config.panel_hidden_height}px`
    Bone.panel_active = false
}

// Makes changes depending on auto hide top panel setting
Bone.apply_auto_hide_panel = function()
{
    if(Bone.storage.auto_hide_panel)
    {
        Bone.$('#webview_containers').style.top = `${Bone.config.panel_hidden_height}px`
        Bone.start_panel_auto_hide()
    }
    
    else
    {
        Bone.$('#webview_containers').style.top = `${Bone.config.panel_height}px`
        Bone.show_panel()
    }    
}

// Updates the webview indicator in the panel
Bone.update_focused_webview = function()
{
    Bone.$('#panel_focused').textContent = `Focused: ${Bone.num()}`
}

// Setups the url bar
Bone.setup_url_input = function()
{
    let url = Bone.$('#url')

    url.addEventListener('keydown', function(e)
    {
        if(!Bone.url_suggest_on)
        {
            Bone.show_url_suggest()
        }

        if(e.key === 'ArrowDown')
        {
            Bone.url_suggest_move_down()
            e.preventDefault()
            return false
        }

        else if(e.key === 'ArrowUp')
        {
            Bone.url_suggest_move_up()
            e.preventDefault()
            return false
        }

        else if(e.key === 'Enter')
        {
            Bone.apply_url_suggest_selected()
            e.preventDefault()
            return false
        }

        else
        {
            Bone.update_url_suggest()
        }
    })

    url.addEventListener('input', function(e)
    {
        if(!Bone.url_suggest_on)
        {
            Bone.show_url_suggest()
        }

        Bone.update_url_suggest()
    })

    url.addEventListener('blur', function()
    {
        if(Bone.url_suggest_on)
        {
            if(Bone.url_suggest_clicked)
            {
                return false
            }

            Bone.hide_url_suggest()
        }
    })
}

// Setups the url suggest box
Bone.setup_url_suggest = function()
{
    let box = Bone.$('#url_suggest')

    box.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('url_suggest_item'))
        {
            return false
        }

        Bone.change_url_suggest_selected(e.target)
        Bone.apply_url_suggest_selected()
    })

    box.addEventListener('mousedown', function()
    {
        Bone.url_suggest_clicked = true
    })
}

// Changes the selected url suggest item
Bone.change_url_suggest_selected = function(item)
{
    if(Bone.url_suggest_selected)
    {
        Bone.url_suggest_selected.classList.remove('url_suggest_selected')
    }

    item.classList.add('url_suggest_selected')
    Bone.url_suggest_selected = item
}

// Sets the url in the panel
Bone.update_url = function()
{
    let input = Bone.$('#url')
    input.value = Bone.swv().url
}

// Setups the url suggestion box
Bone.show_url_suggest = function()
{
    let box = Bone.$('#url_suggest')
    let url = Bone.$('#url')

    box.style.top = `${Bone.config.panel_height}px`
    box.style.left = `${url.offsetLeft + 10}px`
    box.style.display = 'grid'
    Bone.url_suggest_selected = false
    Bone.url_suggest_clicked = false
    Bone.url_suggest_on = true
}

// Hides the url suggestion box
Bone.hide_url_suggest = function()
{
    let box = Bone.$('#url_suggest')
    box.style.display = 'none'
    Bone.url_suggest_on = false
}

// Updates the url suggest box
Bone.update_url_suggest = function()
{
    let matches = Bone.find_url_matches(url.value)

    if(matches.length === 0)
    {
        return false
    }

    let box = Bone.$('#url_suggest')
    box.innerHTML = ''
    
    for(let url of matches)
    {
        let item = document.createElement('div')
        item.classList.add('url_suggest_item')
        item.classList.add('action')
        item.textContent = url
        item.dataset.url = url
        box.append(item)
    }

    Bone.change_url_suggest_selected(Bone.$$('.url_suggest_item')[0])
}

// Moves down a step in the url suggest box
Bone.url_suggest_move_down = function()
{
    let items = Bone.$$('.url_suggest_item')
    
    if(items.length === 0)
    {
        return false
    }

    let n = Bone.get_child_index(Bone.url_suggest_selected) + 1

    if(n > items.length - 1)
    {
        return false
    }

    let item = Bone.get_child_at_index(Bone.$('#url_suggest'), n)
    Bone.change_url_suggest_selected(item)
}

// Moves up a step in the url suggest box
Bone.url_suggest_move_up = function()
{
    let items = Bone.$$('.url_suggest_item')

    if(items.length === 0)
    {
        return false
    }

    let n = Bone.get_child_index(Bone.url_suggest_selected) - 1

    if(n < 0)
    {
        return false
    }

    let item = Bone.get_child_at_index(Bone.$('#url_suggest'), n)
    Bone.change_url_suggest_selected(item)
}

// Applies the action for the selected url suggest item
Bone.apply_url_suggest_selected = function()
{
    if(!Bone.url_suggest_selected)
    {
        return false
    }

    Bone.change_url(Bone.url_suggest_selected.dataset.url)
    Bone.hide_url_suggest()
}