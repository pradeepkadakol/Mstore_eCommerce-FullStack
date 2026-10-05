import { TestBed } from '@angular/core/testing';

import { EcommerceService } from './ecommerce.service';

describe('EcommerceService', () => {
  let service: EcommerceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcommerceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends a single JSON content type for checkout and reviews', async () => {
    const fetchSpy=spyOn(window,'fetch').and.returnValue(Promise.resolve(new Response('{}',{status:201})));
    localStorage.setItem('token','Bearer test-token');
    try {
      await service.placeOrderService('product-id',{billing_address:'123 Main Street',payment_method:'cash-on-delivery'});
      await service.addReviewService('product-id',{description:'Good',rating:5});

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      for (const [,options] of fetchSpy.calls.allArgs()) {
        const headers=new Headers((options as RequestInit).headers);
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('Authorization')).toBe('Bearer test-token');
      }
    } finally {
      localStorage.removeItem('token');
    }
  });

  it('does not add JSON content type to public catalog reads', async () => {
    const fetchSpy=spyOn(window,'fetch').and.returnValue(Promise.resolve(new Response('[]',{status:200})));

    await service.ProductsService('phone');
    await service.categoryService();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    for (const [,options] of fetchSpy.calls.allArgs()) {
      const headers=new Headers((options as RequestInit).headers);
      expect(headers.get('Content-Type')).toBeNull();
    }
  });
});
