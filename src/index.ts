if (!Object.entries)
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };

class Serializer {
    declare types: any[];

    constructor(types: any[]) {
        this.types = types;
    }

    serialize(object: any): string {
        return JSON.stringify(this._serialize(object));
    }

    deserialize(str: string): any {
        return this._deserialize(JSON.parse(str));
    }

    private _serialize(object: any): object {
        if (!(object instanceof Object)) return object;

        const index = this.types.findIndex(e => e.name == object.constructor.name);
        if (index == -1)
            throw new Error(`SerializerException Type '${object.constructor.name}' is not supported for serialization`);

        return {
            index,
            entries: Object.entries(object).map(([key, value]) => ([key, this._serialize(value)]))
        };
    }

    private _deserialize(data: any): any {
        if (data !== Object(data)) return data;

        const obj = new this.types[data.index]();
        data.entries.map((entry: any) => obj[entry[0]] = this._deserialize(entry[1]));
        return obj;
    }
}

export default Serializer;
export {Serializer};