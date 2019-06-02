// Fetch a single element
Bone.$ = function(s)
{
    return document.querySelector(s)
}

// Fetch multiple elements
Bone.$$ = function(s)
{
    return Array.from(document.querySelectorAll(s))
}

// Returns a cloned object
Bone.clone_object = function(obj)
{
    return JSON.parse(JSON.stringify(obj))
}

// Rounds to the specified decimal point
Bone.round = function(value, decimals)
{
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

// Gets the element index relative to its parent
Bone.get_child_index = function(element) 
{
    return Array.from(element.parentNode.children).indexOf(element)
}

// Gets a child element at a given index
Bone.get_child_at_index = function(parent, index)
{
    return Array.from(parent.children)[index]
}

// Inserts an element after another one
Bone.insert_after = function(el, reference_node) 
{
    reference_node.parentNode.insertBefore(el, reference_node.nextSibling)
}

// Inserts an element before another one
Bone.insert_before = function(el, reference_node) 
{
    reference_node.parentNode.insertBefore(el, reference_node)
}

Bone.debounce = function(func, wait, immediate) 
{
    let timeout
    
    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() 
    {
        // Store the context of this and any
        // parameters passed to executedFunction
        let context = this
        let args = arguments
            
        // The function to be called after 
        // the debounce time has elapsed
        let later = function() 
        {
            // null timeout to indicate the debounce ended
            timeout = null
                
            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args)
        }
    
        // Determine if you should call the function
        // on the leading or trail end
        let callNow = immediate && !timeout
        
        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the 
        // inside of the previous setTimeout  
        clearTimeout(timeout)
        
        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait)
        
        // Call immediately if you're dong a leading
        // end execution
        if(callNow) func.apply(context, args)
    }
}

// Gets the index of the element relative to its parent
Bone.get_element_index = function(element) 
{
    return [...element.parentNode.children].indexOf(element)
}

// Removes an element
Bone.remove_element = function(element)
{
    element.parentNode.removeChild(element)
}

// Replaces an element with another one
Bone.replace_element = function(replacement, original)
{
    original.parentNode.replaceChild(replacement, original)
}

// Copies a string to the clipboard
Bone.copy_string = function(s)
{
    let textareaEl = document.createElement('textarea')
    document.body.appendChild(textareaEl)
    textareaEl.value = s
    textareaEl.select()
    document.execCommand('copy')
    document.body.removeChild(textareaEl)
}

// Checks and prepares a url
Bone.check_url = function(url)
{
    if(!url.startsWith('http://') && !url.startsWith('https://'))
    {
        if(!url.startsWith('localhost') && !url.startsWith('127.0.0.1'))
        {
            url = `http://${url}`
        }
    }

    return url
}

// Finds global history urls that match a certain url
Bone.find_url_matches = function(url)
{
    url = url.trim()

    if(!url)
    {
        return []
    }

    let matches = []

    for(let url_2 of Bone.storage.global_history)
    {
        if(url.includes(url_2) || url_2.includes(url))
        {
            matches.push(url_2)
        }
    }

    return matches
}