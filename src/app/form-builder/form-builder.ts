

export class Form {
    sections: FormSection[] = [];

    constructor(json: any) {
        for (let section of json.sections) {
            this.sections.push(new FormSection(section));
        }
    }

    buildFormData(): FormData {
        var formData: FormData = new FormData({});

        for (let section of this.sections) {
            for (let field of section.fields) {
                formData.values.push(new FormValue(field));
            }
        }

        return formData;
    }

    combineFormValues(formData: FormData) {
        for (let section of this.sections) {
            for (let field of section.fields) {
                // Find the form value based on the identifier of the field
                var formValue = formData.values
                    .find(t => t.identifier == field.identifier);

                if (formValue)
                    field.setFormValue(formValue);
            }
        }
    }
}

export class FormSection {
    identifier: string;
    name: string;
    fields: FormField[] = [];

    constructor(json: any) {
        this.identifier = json.identifier;
        this.name = json.name;

        for (let field of json.fields) {
            this.fields.push(new FormField(field));
        }
    }
}

export class FormField {
    public identifier: string;
    public label: string;
    public type: string;
    public value: any;

    constructor(json: any) {
        this.identifier = json.identifier;
        this.label = json.label;
        this.type = json.type;
        this.value = json.value;
    }

    setFormValue(formValue: FormValue) {
        this.value = formValue.value;
    }
}

export class FormData {

    public values: FormValue[] = [];

    constructor(json: any) {
        for (let value of json.values || []) {
            this.values.push(new FormValue(value));
        }
    }
}

export class FormValue {

    public identifier: string;
    public label: string;
    public value: string;

    // constructor 
    constructor(json: any) {
        this.identifier = json.identifier;
        this.label = json.label;
        this.value = json.value;
    }
}