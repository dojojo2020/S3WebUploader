import { ComponentRef, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer } from '@angular/core'
import { DomService } from 'src/app/infrastructure/services/dom.service'
import { TooltipComponent } from 'src/app/infrastructure/tooltip/tooltip.component'

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() tooltipPlacement = ''
  @Input() tooltipTitle = ''
  @Input() delay = 0.8
  private currentTooltip: ComponentRef<TooltipComponent>
  constructor(private el: ElementRef, private renderer: Renderer, private dom: DomService) {}

  ngOnInit(): void {
    this.el.nativeElement.addEventListener('mouseover', () => {
      this.show()
    })
    this.el.nativeElement.addEventListener('mouseout', () => {
      if (this.currentTooltip) {
        this.currentTooltip.destroy()
        this.currentTooltip = null
      }
    })
  }

  ngOnDestroy(): void {
    if (this.currentTooltip) {
      this.currentTooltip.destroy()
    }
  }

  show() {
    if (!this.currentTooltip) {
      const elem = this.dom.appendComponentToBody(TooltipComponent)
      this.currentTooltip = elem
      const rect = this.el.nativeElement.getBoundingClientRect()
      elem.instance.tooltipPlacement = this.tooltipPlacement
      elem.instance.elemRect = rect
      elem.instance.tooltipTitle = this.tooltipTitle
      elem.instance.delay = this.delay
    }
  }
}
