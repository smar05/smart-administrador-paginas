import { UrlSecurePipe } from './url-secure.pipe';

describe('UrlSecurePipe', () => {
  it('create an instance', () => {
    const pipe = new UrlSecurePipe();
    expect(pipe).toBeTruthy();
  });
});
