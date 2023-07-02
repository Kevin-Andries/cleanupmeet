interface Form {
    [key: string]: string | boolean;
}

export function parseBooleanValuesInFormData({ ...form }: Form) {
    Object.keys(form).forEach((key) => {
        const value = form[key];

        if (value === 'true') form[key] = true;
        if (value === 'false') form[key] = false;
    });

    return form;
}
