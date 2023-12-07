

class ApiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    paginate() {
        const { page, size } = this.queryData
        if (!page || page <= 0) {
            page = 1
        }
        if (!size || page <= 0) {
            size = 2
        }
        this.mongooseQuery.limit(parentInt(size).skip(parentInt(page) - 1) * parentInt(size))
        return this
    }
    filter() {
        const filterQuery = { ...this.queryData }
        const excludeQueryParams = ['page', 'size', 'limit', 'sort', 'search', 'fields']
        excludeQueryParams.forEach(key => {
            delete filterQuery[key]
        })
        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|ne|nin|in})/g, match => `$${match}`)))
        return this
    }

    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
        return this
    }

    search() {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.search, $options: 'i' } },
                    { description: { $regex: this.queryData.search, $options: 'i' } }

                ]
            })
        }
        return this
    }

    select() {
        this.mongooseQuery.select(this.queryData.fields?.replaceAll(',', ' '))
        return this
    }
}


export default ApiFeatures