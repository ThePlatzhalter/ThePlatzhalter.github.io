class TemplateManager {

    constructor () {

        this.templates = { }
        this.dependencies = {  }

    }

    addTemplate (id) {

        if (this.templates.hasOwnProperty(id))
            throw new Error('Template with ID "' + id + '" already exists!')

        this.templates[id] = new Template(id)

    }

    removeTemplate (id) {

        delete this.templates[id]

    }

    update (id) {

        if (!this.templates.hasOwnProperty(id))
            throw new Error('No template with ID "' + id + '" exists!')

        this.templates[id].update()

        if (this.dependencies.hasOwnProperty(id)) {

            Object.keys(this.dependencies[id]).map((i) =>
                this.update(this.dependencies[id][i])
            )

        }

    }

    addDependency (id, dependentOn) {

        if (!this.dependencies.hasOwnProperty(id)) {
            this.dependencies[id] = [  ]
        }

        Object.keys(dependentOn).map((i) => {

            if (this.dependencies.hasOwnProperty(dependentOn[i]) && this.dependencies[dependentOn[i]].indexOf(id))
                throw new Error('Circular dependencies detected!')

            if (this.dependencies[id].indexOf(dependentOn[i]) == -1)
                this.dependencies[id].push(dependentOn[i])

        })

    }

}

class Template {

    constructor (id) {

        this.id = id
        this.template = Handlebars.compile(document.getElementById(id).innerHTML)

    }

    update () {

        let templateElems = document.getElementsByTagName('template')
        
        if (templateElems.length < 1)
            return

        Object.keys(templateElems).map((keyTmpl) => {

            let templateElem = templateElems[keyTmpl],
                div, ctx

            if (!templateElem.attributes.hasOwnProperty('data-id')) {
                throw new Error('A template tag needs a "data-id" attribute!')
                throw new Error(templateElem)
            }

            ctx = templateElem.attributes.hasOwnProperty('data-ctx')
                ? JSON.parse(templateElem.attributes['data-ctx'].value)
                : {}

            if (templateElem.attributes['data-id'].value.trim() != this.id)
                return

            div = document.createElement('div')
            div.innerHTML = this.template(ctx)

            templateElem.parentNode.replaceChild(div, templateElem)

        })

    }

}

let manager = new TemplateManager()
manager.addTemplate('a')
manager.addTemplate('b')
manager.addDependency('a', [ 'b' ])
manager.update('a')
