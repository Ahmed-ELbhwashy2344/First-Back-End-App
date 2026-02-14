import qs from "qs";
export class APIFeatures {
  constructor(mongooseQuery, queryString, queryparsedUrl) {
    ((this.mongooseQuery = mongooseQuery),
      (this.queryString = queryString),
      (this.queryparsedUrl = queryparsedUrl));
  }
  //1-Pagenation
  paginate() {
    const LIMIT = 5;
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    let SKIP = (page - 1) * LIMIT;
    this.page = page;
    this.mongooseQuery.skip(SKIP).limit(LIMIT);
    return this;
  }
  //2-Filter
  filter() {
    let filterObject = qs.parse(this.queryparsedUrl);
    let excludedQuery = ["sort", "page", "limit", "keyword", "fields"];
    excludedQuery.forEach((q) => delete filterObject[q]);
    console.log(filterObject);

    filterObject = JSON.stringify(filterObject);
    filterObject = filterObject.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    filterObject = JSON.parse(filterObject);
    console.log(filterObject);
    this.mongooseQuery.find(filterObject);
    return this;
  }
  //3-Sort
  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }
  //4-Search
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }
  //5-Selected Fields
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
