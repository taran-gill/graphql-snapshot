export interface schema {
    queryType: fullType,
    mutationType: rootTypesToSkip,
    subscriptionType: rootTypesToSkip,
    types: Array<fullType>
};

export interface rootTypesToSkip {
    fields: Array<{ name: string }>
};

export interface fullType {
    kind: string,
    name: string,
    fields: Array<fieldType>,
    inputFields: inputArguments,
    interfaces: typeRef,
    possibleTypes: Array<typeRef>
};

export interface fieldType {
    name: string,
    args?: Array<inputArguments>,
    type: Array<typeRef>,
    isDeprecated?: boolean
}

export interface inputArguments {
    name: string,
    type: typeRef,
    defaultValue: any
};

export interface typeRef {
    kind: string,
    name?: string
    ofType?: typeRef
}